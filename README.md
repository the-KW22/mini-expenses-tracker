# Mini Expenses Tracker

A personal finance management application to track expenses, incomes, and budgets.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Database:** MongoDB with Mongoose
- **Authentication:** NextAuth.js v5
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Charts:** Recharts
- **Form Handling:** React Hook Form + Zod

## Features

- Track expenses and incomes by category
- Set and monitor monthly budgets
- Dashboard with visual charts and summaries
- Customizable color themes (6 macaron color schemes)
- User profile management
- Responsive design for mobile and desktop

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB database

### Installation

1. Clone the repository

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with the following variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## License

This project is for personal use.
