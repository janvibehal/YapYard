import './globals.css';
import { ReactNode } from 'react';
import { AuthProvider } from '../context/AuthContext';

export const metadata = {
  title: 'DZINR App',
  description: 'Next.js Fullstack App',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 dark:bg-[#0a0a0a] min-h-screen">
        <AuthProvider>
          <main className="w-full min-h-screen p-4 fixed">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
