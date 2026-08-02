# James Baierski — Portfolio

Personal portfolio site. Plain HTML, CSS and JavaScript — no build step, no dependencies.

**Live:** https://jamesbaierski.github.io/

```
.
├── index.html                       # homepage
├── 404.html
├── projects/
│   ├── document-automation.html     # case study 1
│   ├── reporting-platform.html      # case study 2
│   └── legal-rag-assistant.html     # case study 3
├── assets/
│   ├── css/style.css                # entire design system
│   ├── js/main.js                   # nav, scroll reveal, contact form
│   └── files/James_Baierski_Resume.pdf
├── robots.txt
├── sitemap.xml
└── .nojekyll                        # tell GitHub Pages to serve files as-is
```

---

## Before you publish

- [x] **GitHub username** — `JamesBaierski`, wired into every link, the canonical URL, and the sitemap.
- [x] **LinkedIn** — https://www.linkedin.com/in/jbaierski/
- [ ] **Contact form.** Open `assets/js/main.js` and set `FORM_ENDPOINT` (see below).
      Until you do, the form falls back to opening the visitor's email client — which works,
      but loses you the message if they close the tab.
- [ ] **Read the case studies.** Each of the three files in `projects/` starts with an HTML
      comment flagging which details are reconstructed rather than taken verbatim from your
      résumé. Correct anything that doesn't match what you actually built before this is public.

---

## Deploying to GitHub Pages

### Option A — user site at `username.github.io` (recommended)

1. Create a **public** repo named exactly `jamesbaierski.github.io`.
2. From this folder:

   ```bash
   git init
   git add .
   git commit -m "Portfolio site"
   git branch -M main
   git remote add origin https://github.com/JamesBaierski/jamesbaierski.github.io.git
   git push -u origin main
   ```

3. Repo → **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main` / `/ (root)`.
4. Live at `https://jamesbaierski.github.io/` in about a minute.

### Option B — project site at `username.github.io/portfolio`

Same steps, but name the repo `portfolio`. All links in the site are relative, so it works
either way with no changes.

Every later update is just `git add . && git commit -m "..." && git push`.

---

## Wiring up the contact form

The site is static, so the form needs a third-party endpoint to deliver email.

1. Sign up free at [formspree.io](https://formspree.io) (50 submissions/month on the free tier).
2. Create a form and copy its endpoint — it looks like `https://formspree.io/f/xabcdefg`.
3. Paste it into `FORM_ENDPOINT` at the top of `assets/js/main.js`.

The form already includes a honeypot field (`_gotcha`) that silently drops bot submissions,
and submits over `fetch` so visitors stay on the page.

## Custom domain (optional)

Add a file named `CNAME` at the repo root containing just your domain (`jamesbaierski.com`),
then point DNS at GitHub:

- Apex domain — four `A` records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- `www` subdomain — one `CNAME` record pointing at `jamesbaierski.github.io`

Then enable **Enforce HTTPS** in Settings → Pages.

---

## Editing notes

- **Colours, spacing, type** — all CSS custom properties at the top of `assets/css/style.css`.
  Change `--accent` and the whole site follows.
- **Adding a project** — copy any file in `projects/`, edit the content, then add a matching
  `<a class="card card--link">` block to the Work section of `index.html`.
- **Updating the résumé** — drop the new PDF at `assets/files/James_Baierski_Resume.pdf`,
  keeping the filename, and every download link stays correct.
- **Testing locally** — `python -m http.server 8000`, then open `http://localhost:8000`.
