import type { ReactNode } from 'react';
import '../styles/globals.css';
import Providers from '../components/Providers';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-screen bg-slate-50 text-slate-900">
            <a
              href="#main-content"
              className="sr-only z-50 rounded-lg bg-white px-4 py-3 font-semibold text-slate-900 focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-indigo-700"
            >
              Skip to main content
            </a>
            <Navbar />
            <div
              id="main-content"
              tabIndex={-1}
              className="flex-1 px-4 py-6 sm:px-6 lg:px-8"
            >
              {children}
            </div>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
