"""Lokaler Testserver für Daily News: python tests\\server.py  ->  http://localhost:8000/

Setzt die Dateitypen ausdrücklich, weil Python unter Windows .js sonst oft
als text/plain ausliefert und der Browser die Module dann nicht lädt.
"""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

WURZEL = Path(__file__).resolve().parent.parent
PORT = 8000


class Handler(SimpleHTTPRequestHandler):
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        ".js": "text/javascript",
        ".mjs": "text/javascript",
        ".json": "application/json",
        ".webmanifest": "application/manifest+json",
        ".woff2": "font/woff2",
        ".css": "text/css",
        ".html": "text/html; charset=utf-8",
        ".png": "image/png",
    }


if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", PORT), partial(Handler, directory=str(WURZEL)))
    print(f"Daily News läuft auf http://localhost:{PORT}/  (Beenden mit Strg+C)")
    server.serve_forever()
