import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChatBot from "@/components/ai/ChatBot";

export const metadata: Metadata = {
  title: "Saarthi — Your Guide in a New City",
  description:
    "One stop solution for students & bachelors. Find hostels, mess, bike rentals, accommodation, laundry, furniture, books and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <ChatBot />
          </div>
        </Providers>
      </body>
    </html>
  );
}
