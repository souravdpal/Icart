# 🛒 Icart

> Shopping that actually understands you.

Online shopping is noisy. Too many tabs, too many near-identical options, too much second-guessing. **Icart** is an e-commerce platform built to cut through that: less scrolling, less doubt, more "yes, that's the one."

Under the hood, AI agents quietly do the heavy lifting, so the experience feels less like browsing a catalogue and more like shopping with someone who gets your taste.

---

## ✨ Highlights

- 👗 **See it before you buy it**: skip the guesswork and picture how things look on *you*.
- 🎁 **Gifting without the guesswork**: find the right present for the people you care about, without the awkward detective work.
- 🧠 **A store that learns your style**: whether you chase quality, hunt for a deal, or can never pick between the red one and the green one.
- 🔒 **Privacy first**: personalization never means oversharing.

*(More coming. Some surprises are staying in the box for now.)*

---

## 🧰 Tech Stack

| Layer | Tech |
|-------|------|
| Framework | [Next.js](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | CSS / PostCSS |
| Database | SQL (schemas in `lib/sql`) |
| Auth | Cookie-based sessions + Next.js middleware |
| Linting | ESLint |

---

## 📁 Project Structure

```
Icart/
├── app/
│   ├── (auth)/          # login, register, password reset
│   ├── (main)/          # storefront
│   │   ├── about/
│   │   ├── cart/
│   │   ├── components/
│   │   ├── new/         # new arrivals
│   │   ├── prod/        # product pages
│   │   └── user/        # user profile
│   ├── globals.css
│   ├── layout.tsx
│   └── loading.tsx
├── lib/
│   ├── action/          # server actions (auth, cart)
│   ├── cookies/         # session cookie setup & queries
│   ├── product/         # product fetching logic
│   ├── sql/             # DB connection + schema (cart, session, users)
│   └── user/            # user + password handling
├── public/              # static assets
├── middleware.ts        # route protection
├── fake_data.json       # seed / dummy products
└── cart.sql             # cart table setup
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm
- A running SQL database

### Installation

```bash
# clone the repo
git clone https://github.com/souravdpal/Icart.git
cd Icart

# install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file in the root:

```env
# Database
DATABASE_URL=your_database_connection_string

```

### Set up the database

Run the SQL files in `lib/sql/` against your database:

```
schema.sql   → users & products
session.sql  → sessions
cart.sql     → cart
```

### Run it

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🗺️ Roadmap

- [x] Authentication (register / login / reset)
- [x] Product listing & product pages
- [x] Cart
- [ ] AI shopping assistant
- [ ] Virtual try-on
- [ ] Smart gifting
- [ ] Shopper style profiles
- [ ] Checkout & payments

---

## 🤝 Contributing

Ideas, issues and pull requests are welcome. Fork the repo, create a branch, and open a PR.

---

## 👤 Author

**Sourav**: [@souravdpal](https://github.com/souravdpal)

---

<p align="center">Built with ☕ and a lot of "what if shopping didn't suck?"</p>