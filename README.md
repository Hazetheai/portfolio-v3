# Portfolio v3

A static site for Jake Riordan. Pages and work entries come from Notion. The name, email, GitHub, LinkedIn, and CV live in `app/site.config.ts`.

There is no analytics and the site does not set cookies.

## Pages

- `/` introduction and a list of work
- `/about`
- `/work` one scrolling page, no project routes
- `/contact`
- `/imprint` and `/privacy`

## Setup

```sh
pnpm install
cp .env.example .env
```

Fill in `NOTION_API_KEY`. The database ids in `.env.example` point at the Dev Portfolio v3 page in Notion. Set `SITE_URL` to the public origin before a production deploy.

```sh
pnpm content
pnpm dev
pnpm build
```

`pnpm dev` and `pnpm build` fetch Notion first, write `content/site.json`, and save work images into `public/media`. `pnpm content` does only that fetch. Those files are generated and are not committed. Redeploy after editing Notion.

The imprint page has a placeholder where a postal address should go. Replace that line in Notion before publishing a commercial site.

## Deploy

Connect the GitHub repo to Netlify or Vercel and set the same environment variables there.

Netlify uses `netlify.toml`: build command `pnpm build`, publish directory `.output/public`.

On Vercel, use the build command `pnpm build` and the output directory `.output/public`. `vercel.json` sets that so the host serves the static files instead of starting a server.
