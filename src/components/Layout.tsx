import { Link } from "react-router-dom";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-surface text-ink transition-colors duration-200" style={{ display: 'grid', gridTemplateColumns: '44px 1fr' }}>
      {/* Vertical Sidebar (Spine) - matching HTML exactly */}
      <aside className="bg-ink sticky top-0 h-screen flex flex-col items-center justify-between py-6">
        {/* Top Orange Dot */}
        <span className="w-1.5 h-1.5 rounded-full bg-accent-press"></span>

        {/* Rotated Text */}
        <span className="transform -rotate-180 text-[11px] text-surface opacity-85 uppercase tracking-[0.14em] whitespace-nowrap" style={{ writingMode: 'vertical-rl' }}>
          GAZETTAR — ISSUE 14
        </span>

        {/* Bottom Orange Dot */}
        <span className="w-1.5 h-1.5 rounded-full bg-accent-press"></span>
      </aside>

      {/* Main Content */}
      <div className="min-w-0">
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  );
}

function Header() {
  const location = window.location;
  const pathname = location.pathname;

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="border-b border-line sticky top-0 z-40 bg-surface/95 backdrop-blur-sm transition-colors duration-200">
      <div className="px-[clamp(20px,4vw,56px)] py-[22px] flex items-baseline justify-between gap-6 flex-wrap">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <img src="/gazettar logo.png" alt="Gazettar Icon" className="h-[42px] w-auto" />
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1 leading-none">
              <span className="font-sans text-[21px] font-normal text-ink">The</span>
              <span className="font-sans text-[21px] font-bold text-accent-press">Gazettar</span>
            </div>
            <span className="text-[7.5px] text-muted-ink uppercase tracking-[0.2em] mt-0.5">THE WORLD. YOUR WORLD.</span>
          </div>
        </Link>

        <nav className="flex gap-7 text-[14px] items-center">
          <Link
            to="/"
            className={`pb-[3px] border-b transition-all ${isActive('/')
              ? 'border-accent-press text-ink'
              : 'border-transparent text-ink hover:border-accent-press'
              }`}
          >
            Home
          </Link>
          <Link
            to="/category/politics"
            className={`pb-[3px] border-b transition-all ${isActive('/category/politics')
              ? 'border-accent-press text-ink'
              : 'border-transparent text-ink hover:border-accent-press'
              }`}
          >
            Politics
          </Link>
          <Link
            to="/category/technology"
            className={`pb-[3px] border-b transition-all ${isActive('/category/technology')
              ? 'border-accent-press text-ink'
              : 'border-transparent text-ink hover:border-accent-press'
              }`}
          >
            Technology
          </Link>
          <Link
            to="/category/entertainment"
            className={`pb-[3px] border-b transition-all ${isActive('/category/entertainment')
              ? 'border-accent-press text-ink'
              : 'border-transparent text-ink hover:border-accent-press'
              }`}
          >
            Entertainment
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line mt-20 transition-colors duration-200">
      <div className=" px-[clamp(20px,4vw,56px)] py-10">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 items-start">
          {/* Left: Logo + Tagline */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <img src="/gazettar logo.png" alt="Gazettar Icon" className="h-[55px] w-auto" />
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1 leading-none">
                  <span className="font-sans text-[24px] font-normal text-ink">The</span>
                  <span className="font-sans text-[24px] font-bold text-accent-press">Gazettar</span>
                </div>
                <span className="text-[8.5px] text-muted-ink uppercase tracking-[0.2em] mt-1">THE WORLD. YOUR WORLD.</span>
              </div>
            </div>
            <p className="text-[13px] text-muted-ink leading-relaxed">
              Politics, technology and entertainment, reported daily.
            </p>
          </div>

          {/* Middle: Sections */}
          <div>
            <h3 className="text-[11px] font-bold text-ink mb-3 uppercase tracking-wider">
              SECTIONS
            </h3>
            <ul className="space-y-[6px] text-[13px]">
              <li>
                <Link to="/category/politics" className="text-muted-ink hover:text-ink hover:underline transition-colors">
                  Politics
                </Link>
              </li>
              <li>
                <Link to="/category/technology" className="text-muted-ink hover:text-ink hover:underline transition-colors">
                  Technology
                </Link>
              </li>
              <li>
                <Link to="/category/entertainment" className="text-muted-ink hover:text-ink hover:underline transition-colors">
                  Entertainment
                </Link>
              </li>
            </ul>
          </div>

          {/* Right: Copyright */}
          <div className="text-right">
            <p className="text-[13px] text-muted-ink">
              © {new Date().getFullYear()} Gazettar. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
