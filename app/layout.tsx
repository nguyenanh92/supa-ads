import { GeistSans } from "geist/font/sans";
import "./globals.css";
// import Header from "@/components/header";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "ADS | Tỷ giá ngoại tệ",
  description: "ADS | Tỷ giá ngoại tệ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="sticky top-0 bg-background text-foreground">
        {/* <Header /> */}
        <main className="flex flex-col items-center">{children}</main>
      </body>
    </html>
  );
}
