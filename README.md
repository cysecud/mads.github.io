# mads.uniud.it

Website of the **MADS Lab — Methods for Autonomous and Dependable Systems**,
University of Udine. Built with [Jekyll](https://jekyllrb.com) and a custom,
dependency-free theme (plain CSS and a little vanilla JS, self-hosted fonts, no cookies).

## Run locally

```sh
bundle install
bundle exec jekyll serve      # http://localhost:4000
```

## Updating content

Most changes are a matter of editing one file.

| What                     | Where                                    |
|--------------------------|------------------------------------------|
| People                   | `_data/people.yml`                       |
| Projects                 | `_data/projects.yml`                     |
| Funders / partners       | `_data/partners.yml`                     |
| News                     | `_posts/YYYY-MM-DD-title.md`             |
| Research areas           | `_groups/*.md`                           |
| Software                 | `_software/*.md`                         |
| Publications             | `_bibliography/mads.bib` (see below)     |
| Menu                     | `_data/navigation.yml`                   |
| Name, email, address     | `_config.yml`                            |

### Adding a person

Copy a block in `_data/people.yml`. `role` is one of `faculty`, `postdoc`, `phd`,
`student`, `alumni`; `groups` lists research-area ids (`testing`,
`cybersecurity`, `choreographies`). Photos (optional, square) go in
`assets/images/people/`; initials are shown otherwise.

### Writing a news post

Create `_posts/2026-10-04-my-news.md`:

```markdown
---
title: "Paper accepted at ICSE 2027"
tags: ["Testing", "Research"]
---
Text in Markdown…
```

### Publications

Publications are kept in BibTeX and converted to `_data/publications.json`
by a small script (Python 3, no dependencies):

```sh
python3 scripts/bib2json.py
```

Commit both files. The GitHub Actions workflow also runs the script before
every build. Optional extra BibTeX fields:

- `groups = {testing, cybersecurity}`: show the paper on the research-area pages
  and in the group filter;
- `pdf = {https://…}`: link to an open-access PDF.

Duplicate entries (same title and year) are merged automatically.

## Deployment

The site uses only plugins supported by GitHub Pages, so it builds anywhere.

- **GitHub Pages** (current setup): push to `main`. `.github/workflows/pages.yml`
  builds and deploys the site (Settings → Pages → Source: GitHub Actions).
  The `CNAME` file sets the custom domain `mads.uniud.it`, whose DNS record is
  `mads.uniud.it. CNAME cysecud.github.io.`
- **Any web server**: run `JEKYLL_ENV=production bundle exec jekyll build`
  and copy `_site/` to the document root.

Old WordPress URLs (`/members/`, `/downloads/…`, `/contacts/`,
`/thesis-internships/`, and all news posts) are preserved or redirected.
