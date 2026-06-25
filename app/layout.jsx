import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geist = Geist({
    subsets: ["latin"],
});

export const metadata = {
    title: "LocalGadget",
    description: "Location-based gadget shopping platform",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={geist.className} suppressHydrationWarning>
        <Navbar />
        {children}
        </body>
        </html>
    );
}