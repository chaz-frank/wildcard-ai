import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Wildcard AI",
  description: "Wildcard AI workflow for archived meetings",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
      </body>
    </html>
  );
}
