import "./globals.css";
import Navbar from "@/components/Navbar";
import DemoRoleToggle from "@/components/DemoRoleToggle";

export const metadata = {
    title: "LocalGadget",
    description: "Location-based gadget shopping platform",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body suppressHydrationWarning>
        <a className="skipLink" href="#main-content">
            Skip to content
        </a>
        <Navbar />
        <DemoRoleToggle />
        {children}
        </body>
        </html>
    );
}
