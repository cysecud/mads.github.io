#!/usr/bin/env python3
"""Convert _bibliography/mads.bib into _data/publications.json.

The site renders publications from the JSON file with plain Liquid, so it
builds on any host (GitHub Pages included) without jekyll-scholar.
No dependencies beyond the Python 3 standard library.

Usage:  python3 scripts/bib2json.py [input.bib] [output.json]

Optional custom BibTeX fields understood by the site:
  groups   = {testing, cybersecurity, choreographies}   working groups
  pdf      = {https://...}                              link to a PDF
  html     = {https://...}                              link to the paper (if no doi/url)
  code     = {https://...}                              link to code / artifact
  note     = {To appear}, award = {Best Paper Award}    shown as a badge
  selected = {true}                                     show on the home page
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "_bibliography" / "mads.bib"
DST = Path(sys.argv[2]) if len(sys.argv) > 2 else ROOT / "_data" / "publications.json"

MACROS = {
    "jan": "January", "feb": "February", "mar": "March", "apr": "April",
    "may": "May", "jun": "June", "jul": "July", "aug": "August",
    "sep": "September", "oct": "October", "nov": "November", "dec": "December",
    "lncs": "Lecture Notes in Computer Science",
    "entcs": "Electronic Notes in Theoretical Computer Science",
    "eptcs": "Electronic Proceedings in Theoretical Computer Science",
    "lipics": "Leibniz International Proceedings in Informatics (LIPIcs)",
    "tcs": "Theoretical Computer Science",
}

ACCENTS = {"'": "\u0301", "`": "\u0300", "^": "\u0302", '"': "\u0308",
           "~": "\u0303", "=": "\u0304", ".": "\u0307", "u": "\u0306",
           "v": "\u030c", "H": "\u030b", "c": "\u0327", "k": "\u0328"}
SYMBOLS = {"ss": "ß", "o": "ø", "O": "Ø", "aa": "å", "AA": "Å", "ae": "æ",
           "AE": "Æ", "l": "ł", "L": "Ł", "i": "ı", "&": "&", "%": "%",
           "_": "_", "#": "#", "$": "$"}

TYPES = {"article": "Journal article", "inproceedings": "Conference paper",
         "incollection": "Book chapter", "inbook": "Book chapter",
         "book": "Book", "proceedings": "Edited volume",
         "phdthesis": "PhD thesis", "mastersthesis": "Master thesis",
         "techreport": "Technical report", "misc": "Other"}


def parse_entries(text):
    """Yield (type, key, raw, fields) for each @entry, honouring nested braces."""
    i = 0
    while True:
        m = re.compile(r"@(\w+)\s*([{(])", re.S).search(text, i)
        if not m:
            return
        etype = m.group(1).lower()
        start, depth, j = m.start(), 1, m.end()
        while j < len(text) and depth:
            if text[j] in "{(":
                depth += 1
            elif text[j] in "})":
                depth -= 1
            j += 1
        body = text[m.end():j - 1]
        i = j
        if etype in ("string", "comment", "preamble"):
            if etype == "string":
                k, _, v = body.partition("=")
                MACROS[k.strip().lower()] = parse_value(v.strip())
            continue
        key, _, rest = body.partition(",")
        yield etype, key.strip(), text[start:j].strip(), parse_fields(rest)


def parse_value(v):
    """Parse a field value: {..}, ".." or bare macro/number, joined with #."""
    parts, i = [], 0
    while i < len(v):
        c = v[i]
        if c == "{":
            depth, j = 1, i + 1
            while j < len(v) and depth:
                depth += {"{": 1, "}": -1}.get(v[j], 0)
                j += 1
            parts.append(v[i + 1:j - 1])
            i = j
        elif c == '"':
            j = i + 1
            while j < len(v) and v[j] != '"':
                j += 1
            parts.append(v[i + 1:j])
            i = j + 1
        elif c.isalnum():
            j = i
            while j < len(v) and (v[j].isalnum() or v[j] in "_-:."):
                j += 1
            word = v[i:j]
            parts.append(MACROS.get(word.lower(), word))
            i = j
        else:
            i += 1
    return "".join(parts)


def parse_fields(body):
    fields, i = {}, 0
    while i < len(body):
        m = re.compile(r"\s*([\w:-]+)\s*=\s*", re.S).match(body, i)
        if not m:
            i += 1
            continue
        name, j, depth, quote = m.group(1).lower(), m.end(), 0, False
        k = j
        while k < len(body):
            ch = body[k]
            if ch == "{":
                depth += 1
            elif ch == "}":
                depth -= 1
            elif ch == '"' and depth == 0:
                quote = not quote
            elif ch == "," and depth == 0 and not quote:
                break
            k += 1
        fields[name] = parse_value(body[j:k].strip())
        i = k + 1
    return fields


def delatex(s):
    s = re.sub(r"\\([" + re.escape("'`^\"~=.") + r"])\s*\{?\\?(\w)\}?",
               lambda m: m.group(2) + ACCENTS[m.group(1)], s)
    s = re.sub(r"\\([uvHck])\s*\{\\?(\w)\}", lambda m: m.group(2) + ACCENTS[m.group(1)], s)
    s = re.sub(r"\\(ss|aa|AA|ae|AE|o|O|l|L|i)(?![a-zA-Z])\s?", lambda m: SYMBOLS[m.group(1)], s)
    s = re.sub(r"\\([&%_#$])", lambda m: SYMBOLS[m.group(1)], s)
    s = re.sub(r"\\(emph|textit|textbf|textsc|texttt|mathrm|mathsf|url)\s*", "", s)
    s = s.replace("--", "–").replace("~", " ").replace("\\ ", " ")
    s = re.sub(r"\$([^$]*)\$", r"\1", s)
    s = s.replace("{", "").replace("}", "").replace("\\", "")
    return re.sub(r"\s+", " ", s).strip()


def split_names(s):
    names = []
    for n in re.split(r"\s+and\s+", s.strip()):
        n = delatex(n)
        if not n or n.lower() == "others":
            continue
        if "," in n:
            last, first = [p.strip() for p in n.split(",", 1)]
            n = f"{first} {last}"
        names.append(n)
    return names


def venue(f, etype):
    if etype == "article":
        v = f.get("journal", "")
        if f.get("volume"):
            v += f" {f['volume']}"
            if f.get("number"):
                v += f"({f['number']})"
        return v
    if etype in ("inproceedings", "incollection", "inbook"):
        v = f.get("booktitle", "")
        if f.get("series") and f.get("volume"):
            v += f", {f['series']} {f['volume']}"
        return v
    if etype == "techreport":
        return f.get("institution", "Technical report")
    if etype in ("book", "proceedings"):
        return ", ".join(x for x in (f.get("series", ""), f.get("publisher", "")) if x)
    return f.get("howpublished", f.get("note", f.get("publisher", "")))


def main():
    text = SRC.read_text(encoding="utf-8")
    out = []
    for etype, key, raw, f in parse_entries(text):
        doi = f.get("doi", "").strip()
        doi = re.sub(r"^https?://(dx\.)?doi\.org/", "", doi)
        url = f.get("url", f.get("html", f.get("ee", ""))).strip()
        if doi and url.rstrip("/").endswith(doi):
            url = ""
        pub = {
            "key": key,
            "type": etype,
            "type_label": TYPES.get(etype, "Other"),
            "title": delatex(f.get("title", "")).rstrip("."),
            "authors": split_names(f.get("author", "")),
            "editors": split_names(f.get("editor", "")) if not f.get("author") else [],
            "venue": delatex(venue(f, etype)),
            "pages": delatex(f.get("pages", "")),
            "publisher": delatex(f.get("publisher", "")),
            "year": int(re.sub(r"\D", "", f.get("year", "0"))[:4] or 0),
            "doi": doi,
            "url": url,
            "pdf": f.get("pdf", "").strip(),
            "code": f.get("code", "").strip(),
            "note": delatex(f.get("award", f.get("note", ""))),
            "arxiv": f.get("eprint", "") if "arxiv" in f.get("archiveprefix", "").lower() else "",
            "groups": [g.strip() for g in f.get("groups", "").split(",") if g.strip()],
            "selected": f.get("selected", "").lower() in ("true", "yes", "1"),
            "bibtex": "\n".join(l for l in raw.splitlines()
                                if not re.match(r"\s*(bdsk-|date-|timestamp|biburl|bibsource|abstract)", l, re.I)),
        }
        out.append(pub)

    # Merge duplicates (same title, years at most one apart, e.g. a preprint and
    # its published version): keep the richest entry, union the groups.
    def norm(t):
        return re.sub(r"[^a-z0-9]", "", t.lower())

    def richness(p):
        return sum(1 for k in ("doi", "url", "pdf", "code", "venue", "pages") if p[k])

    merged = {}
    for p in out:
        k = (norm(p["title"]), p["year"])
        for dy in (-1, 1):
            if k not in merged and (k[0], k[1] + dy) in merged:
                k = (k[0], k[1] + dy)
        if k in merged:
            q = merged[k]
            groups = sorted(set(q["groups"]) | set(p["groups"]))
            best = p if richness(p) > richness(q) else q
            best["groups"], best["selected"] = groups, q["selected"] or p["selected"]
            merged[k] = best
            print(f"  merged duplicate: {p['title'][:70]} ({p['year']})")
        else:
            merged[k] = p
    out = list(merged.values())
    out.sort(key=lambda p: (-p["year"], p["title"].lower()))
    DST.write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"{len(out)} publications written to {DST.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
