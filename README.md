This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## CMS-backed pages

The Services page reads the Strapi `services` collection (`title`,
`description`, `price`, and an `image` media field). The Contact page reads the
`contact-page` single type (`title`, `description`, `email`, `phone`, and
`address`). Publish the entries and allow read access for those endpoints.

The contact form posts `name`, `email`, and `message` to the Next.js
`/api/contact` endpoint. That endpoint validates the fields and forwards them
as `{ data: { name, email, message } }` to the Strapi
`/api/contact-messages` collection by default. Create that collection with
those fields and enable create access for the server API token, or configure
Strapi's public create permission if a token is not used.

Set `NEXT_PUBLIC_BACKEND` to the Strapi base URL. Optionally set
`STRAPI_CONTACT_ENDPOINT` to a different Strapi API path (it must start with
`/api/`) and `STRAPI_API_TOKEN` to a server-side Strapi API token. Do not expose
the token with a `NEXT_PUBLIC_` variable. The About team-member links use the
member's Strapi `documentId` when available and otherwise its numeric ID.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
