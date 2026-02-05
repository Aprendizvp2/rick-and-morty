import { type ReactNode } from "react";
import Footer from "../Footer/Footer";

interface LayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
