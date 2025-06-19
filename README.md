# AppEasy – Next.js Job Tracker

A modern job application tracker with AI-powered job description analysis, built with Next.js, TypeScript, Tailwind CSS, and OpenAI.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or newer recommended)
- **npm** (v9 or newer)

### 1. Clone the Repository
```sh
git clone <your-repo-url>
cd IntuitiveDashboard
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the project root (see `.env.example` for required variables):
```
OPENAI_API_KEY=your-openai-api-key-here
DATABASE_URL=your-database-url-here
PORT=5000
```

### 4. Run the App in Development
```sh
npm run dev
```
- The app will be available at [http://localhost:5000](http://localhost:5000)

### 5. Build and Run for Production
```sh
npm run build
npm start
```

---

## Features
- Add, edit, and delete job applications
- AI-powered job description analysis (OpenAI GPT-4o)
- Color-coded status badges
- Form validation and toasts
- Dark mode toggle
- Simple local email/password authentication

---

## Folder Structure
- `src/pages/` – Next.js pages (routes)
- `src/components/` – UI components
- `src/hooks/` – React hooks
- `src/lib/` – Utility libraries (OpenAI, storage, etc.)
- `src/styles/` – Global styles

---

## Deployment
- Ready for Vercel, Netlify, or any Node.js host
- Set environment variables in your deployment dashboard

---

## License
MIT 