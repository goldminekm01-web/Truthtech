import type { Metadata } from "next";
import "./globals.css";
import TruthTechHeader from "@/components/TruthTechHeader";
import Footer from "@/components/Footer";
import BreakingBar from "@/components/BreakingBar";
import MarketTicker from "@/components/MarketTicker";
import TawkWidget from "@/components/TawkWidget";
import VisitorTracker from "@/components/VisitorTracker";
import { WalletProvider } from "@/components/WalletContext";

export const metadata: Metadata = {
    title: {
        default: "TruthTech — Technology & Markets Intelligence",
        template: "%s | TruthTech",
    },
    description:
        "Independent technology news, market analysis, and digital intelligence for serious readers.",
    metadataBase: new URL(
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    ),
    openGraph: {
        type: "website",
        siteName: "TruthTech",
        locale: "en_US",
        images: ["/og-default.jpg"],
    },
    twitter: {
        card: "summary_large_image",
        site: "@truthtechHQ",
    },
    robots: { index: true, follow: true },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="min-h-screen bg-white text-gray-900 antialiased">
                <WalletProvider>
                    <TawkWidget />
                    <VisitorTracker />
                    <BreakingBar />
                    <TruthTechHeader />
                    <MarketTicker />
                    <main id="main-content" tabIndex={-1} className="outline-none">
                        {children}
                    </main>
                    <Footer />
                </WalletProvider>
            </body>
        </html>
    );
}
