import { PropsWithChildren } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative">
        {/* Minimal professional layout */}
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="fade-in">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

