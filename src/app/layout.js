/**
 * Root layout for the AgentPay application
 */

import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'AgentPay - AI-Powered Payment Automation',
  description: 'AI-powered payment automation platform for Cronos x402 hackathon',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}