import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Acortador de URL",
  description: "Acortador de URL, uso gratuito.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${raleway.variable} antialiased text-slate-400`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
