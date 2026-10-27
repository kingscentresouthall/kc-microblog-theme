# Kings Centre Southall Micro.blog theme

This repository is the canonical source for the Kings Centre Southall public website theme on Micro.blog.

## Purpose

- Preserve the approved Kings Centre design and accessible public content.
- Integrate news at `/news/` instead of presenting it as a separate attached site.
- Keep the website portable, versioned and recoverable outside the hosting provider.
- Support a staging-first release process with no direct edits to the production theme.

## Structure

- `layouts/`: Hugo templates used by Micro.blog.
- `static/`: versioned CSS and JavaScript.
- `content/`: staging copies of current public pages. Production pages should ultimately be maintained through Micro.blog Pages.
- `scripts/`: repeatable import and validation tools.

Large photographs and videos are deliberately not committed to this theme. During staging they load from the current public website; before production cutover they will be copied into Micro.blog's media library and the references updated.

## Rebuild the staging content

From this directory:

```text
node scripts/import-current-site.mjs ../wix-fixes-preview/dist ./content
node scripts/validate-theme.mjs
```

## Release process

1. Make and review changes in GitHub.
2. Increment the version in `plugin.json`.
3. Install or update the plug-in on the Micro.blog test site.
4. Check desktop, mobile, menus, page links, news, RSS and accessibility.
5. Only after approval, apply the tested release to production.

The live `kingscentresouthall.org.uk` domain must not be moved during staging.

