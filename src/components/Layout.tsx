import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children, footer = true }: { children: React.ReactNode; footer?: boolean }) => (
  <div className="flex min-h-screen flex-col">
    <Navbar />
    <main className="flex-1">{children}</main>
    {footer && <Footer />}
  </div>
);

export default Layout;

export const PageHeader = ({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }) => (
  <section className="hero-gradient dotted-bg text-primary-foreground">
    <div className="container py-10 md:py-14">
      <h1 className="text-4xl font-extrabold md:text-5xl">{title}</h1>
      {subtitle && <p className="mt-2 max-w-2xl text-lg opacity-90">{subtitle}</p>}
      {children}
    </div>
  </section>
);
