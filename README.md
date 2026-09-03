# Lych1e1.github.io

Minimal Hugo scaffold for the personal site at `https://lych1e1.github.io/`.

## Local development

```powershell
hugo server --buildDrafts
```

Open `http://localhost:1313/`.

## Create content

```powershell
hugo new content posts/example.md
```

## Build

```powershell
hugo --gc --minify
```

Pushing `main` runs `.github/workflows/hugo.yml` and deploys the generated `public/` directory to GitHub Pages.
