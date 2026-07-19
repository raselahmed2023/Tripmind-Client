import { Navbar } from "./navbar";
import { Footer } from "./footer";

interface PageLayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
}

export function PageLayout({
  children,
  showNavbar = true,
  showFooter = true,
}: PageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {showNavbar && <Navbar />}
      <main className="flex-1">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
}
