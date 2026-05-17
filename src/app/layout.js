import { Outfit } from "next/font/google";
import "./globals.css";
import Link from 'next/link';

const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "AtomQuest - Goal Tracking Portal",
  description: "In-House Goal Setting & Tracking Portal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={outfit.className}>
      <body>
        <header className="header-nav">
          <Link href="/" className="header-logo gradient-text">
            Atom<span className="brand-gradient">Quest</span> Tracker
          </Link>
          <div className="flex-gap">
            {/* Nav items */}
          </div>
        </header>
        <main className="page-container animate-fade-in">
          {children}
        </main>
      </body>
    </html>
  );
}
