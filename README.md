# Tech Glimpse

A clean tech news reader that pulls stories from Hacker News and presents them with metadata (images, descriptions) rather than just bare links.

Built with Next.js, deployed on Vercel.

## Stack

Next.js 15 (App Router) · Tailwind CSS v4 · Radix UI · Resend · Google Sheets

Data from [Hacker News Firebase API](https://github.com/HackerNews/API).

## Features

- Fetches top, best, new, Ask HN, and job stories from Hacker News
- Enriches each link with Open Graph metadata (image, description)
- Compact and expanded card views
- Infinite scroll on browse page
- Dark mode with system preference detection + manual toggle
- Daily email newsletter via Resend
- Email unsubscribe flow

### In progress / planned

- [ ] Detail page — view story comments without leaving the site
- [ ] Reading time estimate per article
- [ ] Search — filter fetched stories client-side
- [ ] Share button — copy link or share to social media
- [ ] PWA — installable on mobile
- [ ] RSS feed

## Usage

Try it at [tech-glimpse.odeardika.com](https://tech-glimpse.odeardika.com).

## Install

```bash
git clone https://github.com/odeardika/Tech-Glimpse.git
cd Tech-Glimpse
bun install
bun dev
```

## License

MIT
