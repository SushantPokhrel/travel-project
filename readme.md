# 🌍 Travel Guide Project

Welcome to the Travel Guide Project! This repository is a full-stack web application configured with a parent repository containing both the frontend and backend applications.

### 👥 Team Members

- **Sushant Khatiwada**
- **Sushant Pokhrel**
- **Aayush**

### 📁 Project Structure

- `/client` — Frontend user interface powered by **React + Vite**
- `/server` — Backend API server powered by **Node.js + Express**

---

## 🚀 Local Setup Guide

Follow these steps sequentially to set up and run the project locally on your machine.

### 📋 Prerequisites

Ensure you have the following software installed:

- [Node.js](https://nodejs.org) (v18.0.0 or higher recommended)
- [Git](https://git-scm.com)

---

### Step 1: Clone the Repository

Open your terminal or command prompt, navigate to your desired directory, and clone the project:

```bash
# Clone the parent repository
git clone `[repo-url]`

# Move into the project root folder
cd travel-project
```

---

### Step 2: Set Up the Node.js Server (Backend)

Navigate to the server directory to install dependencies and configure environment variables.

```bash
# 1. Move into the server folder
cd server

# 2. Install backend dependencies
npm install

# 3. Create your local environment file
# (Copy the template if .env.example exists, or create a blank .env file)
cp .env.example .env.development
```

> 💡 _Note: Open the `.env` file in your code editor and fill in your private configurations (database URI, secret keys, ports, etc.)._

**To start the backend server:**

```bash
npm run dev
# If 'dev' script isn't configured, use: npm start
```

---

### Step 3: Set Up the React Vite Client (Frontend)

Open a **new terminal tab or window**, return to the root of the project, and initialize the frontend application.

```bash
# 1. From the project root, move into the client folder
cd client

# 2. Install frontend dependencies
npm install

# 3. Create your local environment file
cp .env.example .env.development
```

>

**To start the Vite development server:**

```bash
npm run dev
```

Once the compilation is complete, Vite will display a local URL (usually `http://localhost:5173`). Open this URL in your web browser to interact with the web application.

---

## 🛠️ Basic Troubleshooting

- **Vite Port in Use:** If port `5173` is occupied, Vite will automatically look for the next available port (e.g., `5174`). Check your terminal output for the correct local link.
- **Push Protection Warning:** If your git push fails due to leaked credentials, ensure your environment variables are safely removed from git tracking and included in your `.gitignore` files.
- **You would need a .env file:** For both backend and frontend to run the application successfully, so request the owner of the repo for the env credentials.
