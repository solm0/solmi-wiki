import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import InternalLinkTooltip from "./component/internallink-tooltip";
import Header from "./component/header/header";
import { Suspense } from "react";
import Inspector from "./component/inspector/inspector";
import Script from "next/script";
import YoutubePlayer from "./component/music/YoutubePlayer";
import MainContentShell from "./component/layout/MainContentShell";

export const metadata: Metadata = {
  title: "solmi.wiki",
  description: "Website of Solmi Jeong",
  icons: {
    icon: '/favicon.png',
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`antialiased font-normal md:overflow-hidden overflow-x-hidden bg-background`}
      >
        <Script
          src="//gc.zgo.at/count.js"
          data-goatcounter="https://solmiwiki.goatcounter.com/count"
          strategy="afterInteractive"
        />
        <ThemeProvider disableTransitionOnChange>
          <div className="flex h-screen w-full pt-0 gap-0 md:gap-7">

            <h1 className="hidden">page</h1>

            {/* 헤더 */}
            <Header />

            {/* 왼쪽 사이드 */}
            <Suspense>
              <Inspector />
            </Suspense>

            {/* 가운데 */}
            <MainContentShell>
              {children}
            </MainContentShell>
          </div>

          {/* 내부링크 툴팁 */}
          <InternalLinkTooltip />

          {/* 음악 */}
          <YoutubePlayer />
        </ThemeProvider>
      </body>
    </html>
  );
}
