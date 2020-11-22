export interface NewsRecord {
  id: number;
  newsFeedName: string;
  title: string;
  link: string;
  date: string;
  parsedDate?: Date;
}

export interface FeedRecord {
  name: string;
  link: string;
}
