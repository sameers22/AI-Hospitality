# AI-Waiter

Minimal SaaS slice demonstrating a customer ordering page on a sub-domain and a kitchen staff app.

## Tech Stack
- **Frontend:** React + Vite with Tailwind via CDN
- **Backend:** Node.js 18+ with Express
- **Database:** Prisma ORM (PostgreSQL)
- **AI:** OpenAI Chat Completions using function calling

## Development

1. Install dependencies
   ```bash
   npm install
   cd client && npm install
   ```
2. Define a `.env` file with your `DATABASE_URL` and `OPENAI_API_KEY`.
3. Start the API server
   ```bash
   node server/index.js
   ```
4. In another terminal run the frontend
   ```bash
   npm run dev --prefix client
   ```

The app expects restaurant subdomains (e.g. `demo`) to exist in the database.
