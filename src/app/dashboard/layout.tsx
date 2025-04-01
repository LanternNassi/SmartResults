import type { Metadata } from "next";

import Navbar from "@/components/Navbar";


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
      <body>
        
          <Navbar>
            {children}
          </Navbar>
        
      </body>
    </html>
  );
}
