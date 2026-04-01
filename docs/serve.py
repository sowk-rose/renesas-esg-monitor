#!/usr/bin/env python3
"""Simple HTTP server for the Renesas ESG Monitor web app."""
import http.server
import os
import sys

PORT = 8081
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache')
        if self.path.endswith('.js'):
            self.send_header('Content-Type', 'application/javascript')
        super().end_headers()

    def do_GET(self):
        # Serve files from public directory for static assets
        if self.path.startswith('/public/') or self.path == '/favicon.png':
            if self.path == '/favicon.png':
                self.path = '/public/favicon.png'
        super().do_GET()

if __name__ == '__main__':
    os.chdir(DIRECTORY)
    with http.server.HTTPServer(('0.0.0.0', PORT), Handler) as httpd:
        print(f"Serving Renesas ESG Monitor on http://0.0.0.0:{PORT}")
        sys.stdout.flush()
        httpd.serve_forever()
