import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Figtree } from 'next/font/google';


const figtree = Figtree({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-figtree',
  weight: ['300', '400', '500', '600', '700', '800', '900']
});


export const metadata: Metadata = {
  title: "Smart Results",
  description: "This is a solution to help students access exams digitally",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={figtree.variable}>
        {children}
      </body>
    </html>
  );
}

export const dynamic = 'force-dynamic'

