from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import urllib.parse as urlparse
from urllib.parse import parse_qs

from RSS import init_feeds, get_feeds, get_all_news_by_feed, write_to_db

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
            json_string = json.dumps(
                {'feeds': r})
            self.wfile.write(json_string.encode())

        elif self.path.startswith('/update'):
            parsed = urlparse.urlparse(self.path)
            feed = parse_qs(parsed.query)['feed'][0]
            print(feed)
            write_to_db(feed)
            r = get_all_news_by_feed(feed)
            json_string = json.dumps(
                {'news': r}
            )
            self.wfile.write(json_string.encode())


def run(server_class=HTTPServer, handler_class=Server):
    init_feeds()
    server_address = (IP, PORT)
    httpd = server_class(server_address, handler_class)

    print(f'server is up: see http://localhost:8080/')
    httpd.serve_forever()


if __name__ == '__main__':
    run()
