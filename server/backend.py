from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import urllib.parse as urlparse
from urllib.parse import parse_qs

from RSS import init_feeds, get_feeds, get_all_news_by_feed, write_to_db, add_feed

IP = "127.0.0.1"
PORT = 8080


class Server(BaseHTTPRequestHandler):
    def _set_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

    def do_GET(self):
        self._set_headers()

        print(self.path)
        if self.path == '/feeds':
            r = get_feeds()
            json_string = json.dumps(r)
            self.wfile.write(json_string.encode())

        elif self.path.startswith('/update'):
            parsed = urlparse.urlparse(self.path)
            feed = parse_qs(parsed.query)['feed'][0]
            print(feed)
            write_to_db(feed)
            r = get_all_news_by_feed(feed)
            json_string = json.dumps(r)
            self.wfile.write(json_string.encode())

        elif self.path.startswith('/add'):
            parsed = urlparse.urlparse(self.path)
            feed_name = parse_qs(parsed.query)['name'][0]
            feed_link = parse_qs(parsed.query)['link'][0]
            print(f'new feed resource: {feed_name} at {feed_link}')
            add_feed(feed_name, feed_link)


def run(server_class=HTTPServer, handler_class=Server):
    init_feeds()
    server_address = (IP, PORT)
    httpd = server_class(server_address, handler_class)

    print(f'server is up: see http://localhost:8080/')
    httpd.serve_forever()


if __name__ == '__main__':
    run()
