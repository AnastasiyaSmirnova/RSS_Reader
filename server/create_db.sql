create schema python_rss
    create table news(
        id serial PRIMARY KEY,
        news_feed_name text NOT NULL,
        title text NOT null,
        date text,
        link text
    )