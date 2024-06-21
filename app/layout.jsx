import { Inter } from "next/font/google";
import "./globals.css";
import clsx from "clsx";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Png Elevation",
  description: "Elevate your PNG files",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={clsx(inter.className, "h-full")}>{children}</body>
    </html>
  );
}
