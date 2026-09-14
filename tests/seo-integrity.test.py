"""Checks public sitemap pages with Python's standard library only.

Run: python3 tests/seo-integrity.test.py
"""
import json
from html.parser import HTMLParser
from pathlib import Path
import unittest
from urllib.parse import urlsplit
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]


class Page(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.meta = {}
        self.canonicals = []
        self.links = []
        self.schemas = []
        self.forms = []
        self.form = None
        self.json_block = None
        self.h1_count = 0
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "meta":
            key = attrs.get("property", attrs.get("name"))
            self.meta.setdefault(key, []).append(attrs.get("content", ""))
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonicals.append(attrs.get("href"))
        if tag == "h1":
            self.h1_count += 1
        if tag == "script" and attrs.get("type") == "application/ld+json":
            self.json_block = ""
        if tag == "form":
            self.form = {"lead": "nurtex-lead-form" in attrs.get("class", ""), "links": []}
        if tag == "a":
            self.links.append(attrs.get("href"))
            if self.form is not None:
                self.form["links"].append(attrs.get("href"))

    def handle_data(self, data):
        if self.json_block is not None:
            self.json_block += data

    def handle_endtag(self, tag):
        if tag == "script" and self.json_block is not None:
            self.schemas.append(json.loads(self.json_block))
            self.json_block = None
        if tag == "form" and self.form is not None:
            self.forms.append(self.form)
            self.form = None


def objects(value):
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from objects(child)
    elif isinstance(value, list):
        for child in value:
            yield from objects(child)


class SeoIntegrity(unittest.TestCase):
    def test_public_pages(self):
        urls = [n.text for n in ET.parse(ROOT / "sitemap.xml").findall(".//{*}loc")]
        self.assertTrue(urls)
        for url in urls:
            with self.subTest(url=url):
                path = urlsplit(url).path.strip("/")
                file = ROOT / path / "index.html" if path else ROOT / "index.html"
                page = Page(file.read_text())
                self.assertEqual(page.canonicals, [url])
                self.assertEqual(page.h1_count, 1)
                self.assertNotIn("noindex", " ".join(page.meta.get("robots", [])))
                for key in ["og:title", "og:description", "og:type", "og:url", "og:image", "twitter:card", "twitter:image"]:
                    self.assertEqual(len(page.meta.get(key, [])), 1, key)
                    self.assertTrue(page.meta[key][0], key)
                self.assertEqual(page.meta["og:url"], [url])
                for key in ["og:image", "twitter:image"]:
                    image = urlsplit(page.meta[key][0])
                    self.assertEqual(image.hostname, "nurtex.pl")
                    self.assertTrue((ROOT / image.path.lstrip("/")).is_file(), image.path)
                if path != "polityka-prywatnosci":
                    self.assertIn("/polityka-prywatnosci", page.links)
                for form in page.forms:
                    if form["lead"]:
                        self.assertIn("/polityka-prywatnosci", form["links"])
                for node in objects(page.schemas):
                    if node.get("@type") == "Service":
                        self.assertNotIn("knowsAbout", node)


if __name__ == "__main__":
    unittest.main()
