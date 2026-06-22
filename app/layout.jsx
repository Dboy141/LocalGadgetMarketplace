import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Local Gadget Marketplace",
  description: "Location-based marketplace for gadgets",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
