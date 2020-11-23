import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FeedRecord, NewsRecord } from './model/Responce';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsFeedService {
  url = 'http://localhost:8080';

  constructor(private http: HttpClient) {
  }

  getAllFeedNames(): Observable<FeedRecord[]> {
    const headers = new HttpHeaders();
    headers.set('Access-Control-Request-Headers', 'Content-Type');
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Request-Method', 'GET');
    return this.http.get<FeedRecord[]>(`${this.url}/feeds`, {headers});
  }

  getNewsByFeed(feedName: string): Observable<[]> {
    const headers = new HttpHeaders();
    headers.set('Access-Control-Request-Headers', 'Content-Type');
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Request-Method', 'GET');
    return this.http.get<[]>(`${this.url}/update?feed=${feedName}`);
  }
}
