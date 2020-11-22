# coding=windows-1251

"""
--- Простой RSS reader ---
    При добавлении ленты (например https://habrahabr.ru/rss/interesting/)
записи из добавленной ленты сканируются и заносятся в базу (например sqlite)
    При нажатии на кнопку обновить - новое сканирование и добавление новых записей (без дублрования существующих)
    Отображение ленты начиная с самых свежих записей с пагинацией (несколько записей на странице)
    Записи из разных лент хранить и показывать отдельно (по названию ленты).
    Внимание:
После сдачи и визирования отчета принести его на лекцию (за 5 мин до начала)
+ Продублировать отчет и исходник(.zip, github и т.п.) письмом на isu
"""

import feedparser
import psycopg2 as db
from psycopg2 import sql
from contextlib import closing
import os


def write_to_db(news_feed_name, arr: [{}]) -> None:
    with closing(db.connect(database="postgres",
                            user=os.getenv('db_user'),
                            password=os.getenv('db_pswd'),
                            host="127.0.0.1",
                            port="5433")) as conn:
        with conn.cursor() as cursor:
            print('--- db open successfully')
            conn.autocommit = True
            """ get all existed title for selected feed name """
            existed_titles = []
            cursor.execute(f'SELECT link FROM python_rss.news WHERE news_feed_name = \'{news_feed_name}\'')
            for row in cursor:
                existed_titles.append(row[0])

            values = []
            """ check if title existed and execute 'insert' """
            for next_article in arr:
                if next_article.get('id') not in existed_titles:
                    values.append((news_feed_name, next_article.get('title'), next_article.get('published'),
                                   next_article.get('id')))
            if len(values) > 0:
                insert = sql.SQL('INSERT INTO python_rss.news (news_feed_name, title, date, link) VALUES {}').format(
                    sql.SQL(',').join(map(sql.Literal, values))
                )
                cursor.execute(insert)
            print('--- db close successfully')


def get_news_feed_name(link: str) -> str:
    start_index = link.index('//') + 2
    end_index = link.index('.')
    return link[start_index:end_index]


def main():
    rss_link = 'https://habrahabr.ru/rss/interesting/'
    # rss_link = 'http://feeds.bbci.co.uk/news/world/rss.xml'
    news_feed_name = get_news_feed_name(rss_link)
    News = feedparser.parse(rss_link)
    """ entries is a list of dictionaries """
    write_to_db(news_feed_name, News.entries[0:10])


if __name__ == '__main__':
    main()
