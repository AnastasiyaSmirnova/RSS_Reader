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

  newFeedName: string;
  newFeedLink: string;

  constructor(private service: NewsFeedService) {
  }

  ngOnInit(): void {
    this.loadFeeds();
  }

  loadFeeds(): void {
    this.service.getAllFeedNames().subscribe(
      data => {
        console.log(data);
        this.loading = false;
        this.feedNamesArray = data;
        this.currentFeedName = this.feedNamesArray[0].name;
        this.updateNews(this.currentFeedName);
      },
      error => {
        this.loading = false;
        alert(`something wrong is happened: ${error}`);
      }
    );
  }

  parseDate(dateString: string): Date {
    const getMonthNumber = (name: string) => {
      let res = -1;
      ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ].forEach((el, index) => {
        if (el.startsWith(name)) {
          res = index + 1;
        }
      });
      return res;
    };

    /**
     *
     * example of date record: Sun, 22 Nov 2020 11:53:06 GMT
     * needed date string - 2020-11-22T11:53:06
     *
     */
    const dateStringArray = dateString.split(' ');
    console.log(dateStringArray);
    const [day, month, year, time] = dateStringArray.slice(1, 5);
    const formattedDate = `${year}-${getMonthNumber(month)}-${day}T${time}`;
    console.log(formattedDate);
    return new Date(formattedDate);
  }

  updateNews(feedName: string = this.currentFeedName): void {
    if (!feedName) {
      return;
    }
    this.loading = true;
    this.newsArray = [];
    this.service.getNewsByFeed(feedName).subscribe(
      data => {
        console.log(data);
        this.loading = false;
        data.forEach(el => {
          this.newsArray.push({
            title: el[2],
            link: el[4],
            parsedDate: this.parseDate(el[3])
          });
        });
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

  addNewResource(name = this.newFeedName, link = this.newFeedLink): void {
    console.log('add new feed');
    this.service.addNewFeedResource(name, link).subscribe(
      () => {
        this.loadFeeds();
      },
      error => {
        alert(`adding new feed resource failed: ${error}`);
      }
    );
  }
}
