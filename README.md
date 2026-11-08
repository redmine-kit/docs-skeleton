# redmine-kit/docs-skeleton

A [VitePress](https://vitepress.dev/) skeleton that publishes the `docs/` folder of a repository in the [redmine-kit](https://github.com/redmine-kit) organization to GitHub Pages, at `https://redmine-kit.github.io/<repo>/`.

It is based on [pieceofcake2/docs-skeleton](https://github.com/pieceofcake2/docs-skeleton), itself a fork of [cakephp/docs-skeleton](https://github.com/cakephp/docs-skeleton). The CakePHP branding, the book's header menu, the package list and analytics are removed.

This project is not affiliated with the Redmine project.

## Publishing a repository's docs

Add `.github/workflows/docs.yml` to the repository:

```yaml
name: Docs

on:
  push:
    branches: [main]
    paths:
      - 'docs/**'
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  docs:
    if: github.repository_owner == 'redmine-kit'
    uses: redmine-kit/docs-skeleton/.github/workflows/repo-docs.yml@main
```

and set **Settings » Pages » Source** to **GitHub Actions**. The repository `redmine-kit.github.io` is the organization's top site and is published at `https://redmine-kit.github.io/`; link from it to the other sites with `<a href="/<repo>/" target="_self">`, so that the browser loads them instead of this site's router. The reusable workflow `.github/workflows/repo-docs.yml` builds the site with `config.repo.js` and deploys it. It deploys only from the default branch of a repository in the organization.

- **Rebuilding:** the site is rebuilt only when `docs/` changes. After changing something else that the site shows (the workflow, the repository description, `LICENSE`), or after a change to this skeleton, run the workflow by hand from the Actions tab (**Run workflow**).
- **Inputs:** `title` sets the site title, and `skeleton-ref` the branch, tag or SHA of this skeleton to build with (default: `main`). To pin the skeleton, pass the same ref to both:

  ```yaml
  jobs:
    docs:
      if: github.repository_owner == 'redmine-kit'
      uses: redmine-kit/docs-skeleton/.github/workflows/repo-docs.yml@<sha>
      with:
        skeleton-ref: <sha>
        title: My Theme
  ```

The site needs no configuration in the repository:

- **Home page:** `docs/README.md`. Other Markdown files in `docs/` are further pages (`docs/foo/README.md` is served as `foo/`).
- **Title:** the workflow's `title` input, or `title` in the front matter of `docs/README.md`, or its first `#` heading. The Japanese site uses those of `docs/ja/README.md`.
- **Description:** the repository's description, or `Documentation of owner/repo` when it has none.
- **Sidebar:** the pages and their `##` headings. The home page comes first, then the pages in the order `docs/README.md` links them, then the other pages by path. A page's title is its `#` heading (or `title` in its front matter).
- **Links:** link pages by their Markdown file, for example `[Installation](installation.md#docker)`; the site turns them into links to its pages. Links to other files and out of `docs/` (for example `../LICENSE`) point to the file on GitHub, so the Markdown works both on GitHub and on the site.
- **Anchors:** heading anchors are the same as on GitHub. A link to a heading that moved to another page is forwarded to that page.
- **Images:** images in `docs/` (for example `docs/img/`) are bundled. Images must be inside `docs/`: an image outside it (`../screenshot.png`) stops the build.
- **Checked links:** links between pages and to their headings are checked when the site is built, and a broken one stops the build.
- **Vue:** `{{ ... }}` in text and inline code is shown as text, not evaluated. Inside raw HTML it is still evaluated by Vue.

## Japanese translation

Put the Japanese pages in `docs/ja/`, with the same file names as the English pages. When `docs/ja/README.md` exists, the site gets a Japanese version at `/<repo>/ja/`, with a language switcher, its own sidebar and Japanese labels. Links from `docs/ja/` to files of the repository go one level further up, for example `../../LICENSE`.

Japanese headings have other anchors than the English ones. Put the English anchor before each Japanese heading, so that links work in both languages (links to a moved section are forwarded for these anchors too):

```md
<a id="installation"></a>

## インストール
```

## Markdown for AI tools

Every page is also published as Markdown next to its `.html` (`/<repo>/installation.md`), with `llms.txt` and `llms-full.txt` for each language ([llms.txt](https://llmstxt.org/)). Every page links its Markdown in its head and its footer. A page with `llms: false` in its front matter is left out.

## Building a site locally

```sh
npm ci
rsync -a --delete ../redmine_lookbook/docs/ docs/
cp config.repo.js config.js
export DOCS_REPOSITORY=redmine-kit/redmine_lookbook DOCS_SOURCE=../redmine_lookbook
npm run docs:build
npm run docs:preview
```

`docs:preview` reads the configuration too, so it needs the same variables.

`.npmrc` sets `ignore-scripts=true`, so the install scripts of dependencies do not run.

| Variable | Description |
| --- | --- |
| `DOCS_REPOSITORY` | `owner/repo` (required) |
| `DOCS_BRANCH` | The branch of the docs, for "Edit this page" and links to files (default: `main`) |
| `DOCS_SOURCE` | The repository's checkout; its `LICENSE` is linked from the footer |
| `DOCS_TITLE` | The site title (default: the `#` heading of `docs/README.md`) |
| `DOCS_DESCRIPTION` | The site description |

## Project structure

```text
.
├── .vitepress/
│   ├── config.js          # Default VitePress configuration
│   ├── markdown-output.js # Markdown of the pages, llms.txt (buildEnd)
│   ├── utils.js
│   ├── plugins/           # markdown-it plugins (links to GitHub, substitutions)
│   └── theme/             # Theme: colors, Markdown links, moved anchors
├── config.repo.js         # Configuration for a repository's site
└── docs/                  # The repository's docs/, copied in by the workflow
```

## Linting

```sh
npm run lint
```

## License

MIT. See [LICENSE](LICENSE).
