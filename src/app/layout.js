import { Inter } from "next/font/google";
import "./globals.css";
import Link from 'next/link';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AtomQuest - Goal Tracking Portal",
  description: "In-House Goal Setting & Tracking Portal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <header className="header-nav">
          <Link href="/" className="header-logo">
            Atom<span>Quest</span> Tracker
          </Link>
          <div className="flex-gap">
            {/* Nav items will go here. Auth state handles the rest. */}
          </div>
        </header>
        <main className="page-container animate-fade-in">
          {children}
        </main>
      </body>
    </html>
  );
}
