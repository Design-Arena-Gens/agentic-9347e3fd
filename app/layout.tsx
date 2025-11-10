export const metadata = {
  title: "Fitness Dashboard",
  description: "Minimalist fitness tracker dashboard",
};

import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header className="header">
            <h1>Fitness Dashboard</h1>
          </header>
          <main>{children}</main>
          <footer className="footer">
            <span>Built for simplicity ? Local only</span>
          </footer>
        </div>
      </body>
    </html>
  );
}
