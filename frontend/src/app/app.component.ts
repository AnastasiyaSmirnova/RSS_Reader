import { Component, OnInit } from '@angular/core';
import { NewsFeedService } from './news-feed.service';
import { FeedRecord, NewsRecord } from './model/Responce';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  loading = true;

  feedNamesArray: FeedRecord[] = [];
  currentFeedName: string = null;

  newsArray: NewsRecord[] = [];

  constructor(private service: NewsFeedService) {
  }

  ngOnInit(): void {
    this.service.getAllFeedNames().subscribe(
      data => {
        console.log(data);
        this.loading = false;
        this.feedNamesArray = data;
        this.currentFeedName = this.feedNamesArray[0].name;
      },
      error => {
        this.loading = false;
        alert(`something wrong is happened: ${error}`);
      }
    );
  }

  parseDate(dateString: string): Date {
    return new Date(dateString);
  }

  updateNews(feedName: string): void {
    this.loading = true;
    this.service.getNewsByFeed(feedName).subscribe(
      data => {
        console.log(data);
        this.loading = false;
        data.forEach(el => {
          el.parsedDate = this.parseDate(el.date);
        });
        this.newsArray = data;
      },
      error => {
        this.loading = false;
        alert(`something wrong is happened: ${error}`);
      }
    );
  }

  checkCurrentFeedName(name: string): void {
    this.currentFeedName = name;
    this.updateNews(name);
  }
}
