# 🐦 Twitter Clone

A powerful, real-time Twitter inspired clone built with **Next.js**, **GraphQL**, **WebRTC**, and **Prisma**. This full-stack application replicates the core functionality of Twitter, including **real-time tweeting, messaging, video/audio calling, and user presence detection** — all with a sleek and responsive UI.

---

## ✨ Features

### 🔥 Major Features

- ⚡ **Real-Time Tweet Feed** – Instant updates via GraphQL Subscriptions
- 🎥 **Video/Audio Calls** – One-on-one & group calling with WebRTC
- 📨 **DMs & Group Messaging** – Real-time chat system with groups
- 🟢 **Online Presence** – Track user availability via GraphQL presence system
- 🔒 **Auth System** – Secure JWT-based login & signup
- 🧑‍🤝‍🧑 **Follow System** – Follow/unfollow other users
- 📝 **Tweet, Like, Retweet, Reply** – All core tweet interactions
- 📎 **Media Support** – Upload & display images in tweets
- 🔔 **Notifications** – Real-time notifications for interactions
---

### 🧩 Additional Features

- 🧑‍💼 Custom Profiles (bio, avatar, banner)
- 📌 Tweet Bookmarking
- 🎯 Active Speaker Detection in Calls
- 🔄 Infinite Scroll + Pagination
- 🧭 Explore Page
- 🎨 Responsive Design & Accessibility
- 📅 Call History & Metadata Tracking

---

## 🛠 Tech Stack

### 💻 Frontend

- **Next.js**
- **Tailwind CSS** + **Shadcn UI**
- **Apollo Client** – GraphQL queries, mutations, subscriptions
- **Framer Motion** – Animations
- **Lucide Icons** – Modern icon set
- **React Query** - State management and caching

### ⚙️ Backend

- **WebRTC + SFU(pending)** – Real-time media engine
- **Apollo Server** – GraphQL API with Subscriptions
- **graphql-ws** – WebSocket transport for real-time GraphQL
- **Prisma ORM** – Type-safe PostgreSQL access
- **PostgreSQL** – Main database
- **Redis** – PubSub for subscriptions & online presence

### 🧪 Dev & Tooling

- **TypeScript** – Full type-safety
- **ESLint & Prettier** – Code quality
- **Ngrok** – WebRTC signaling during local development
- **Docker**(pending) – Containerization

---
