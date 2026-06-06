import { useNavigate } from "react-router-dom";
import logo from "../assets/SaveMoreLogo.png";

export default function Footer() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Add Expense", href: "/add" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ];

  const handleLinkClick = (e, href) => {
    if (href.startsWith("/")) {
      e.preventDefault();
      navigate(href);
    }
  };

  return (
    <footer className="border-t border-slate-200/70 bg-white/70 backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/50">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="flex flex-col gap-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 rounded-xl px-2 py-1 text-left transition hover:bg-slate-100 dark:hover:bg-slate-800/60 w-fit"
              aria-label="Go to Dashboard"
            >
              <img src={logo} alt="SaveMore Logo" className="h-8 w-8" />
              <div>
                <p className="text-sm font-extrabold text-slate-900 dark:text-slate-50">
                  SaveMore
                </p>
              </div>
            </button>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Smart expense tracking made simple. Manage your finances with
              ease.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              Quick Links
            </h3>
            <nav className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="text-sm text-slate-600 transition hover:text-indigo-700 dark:text-slate-400 dark:hover:text-indigo-300"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Support */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              Support
            </h3>
            <nav className="flex flex-col gap-2">
              <a
                href="#"
                className="text-sm text-slate-600 transition hover:text-indigo-700 dark:text-slate-400 dark:hover:text-indigo-300"
              >
                Help Center
              </a>
              <a
                href="#"
                className="text-sm text-slate-600 transition hover:text-indigo-700 dark:text-slate-400 dark:hover:text-indigo-300"
              >
                Contact Us
              </a>
              <a
                href="#"
                className="text-sm text-slate-600 transition hover:text-indigo-700 dark:text-slate-400 dark:hover:text-indigo-300"
              >
                Report Issue
              </a>
            </nav>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              Legal
            </h3>
            <nav className="flex flex-col gap-2">
              <a
                href="#"
                className="text-sm text-slate-600 transition hover:text-indigo-700 dark:text-slate-400 dark:hover:text-indigo-300"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-sm text-slate-600 transition hover:text-indigo-700 dark:text-slate-400 dark:hover:text-indigo-300"
              >
                Terms & Conditions
              </a>
              <a
                href="#"
                className="text-sm text-slate-600 transition hover:text-indigo-700 dark:text-slate-400 dark:hover:text-indigo-300"
              >
                Cookie Policy
              </a>
            </nav>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-slate-200/70 dark:border-slate-800/60" />

        {/* Copyright */}
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-slate-600 dark:text-slate-400 sm:flex-row">
          <p>© {currentYear} SaveMore. All rights reserved.</p>
          <div className="flex gap-4">
            <a
              href="https://www.linkedin.com/in/sanket-thorat-87b891334/"
              className="transition hover:text-indigo-700 dark:hover:text-indigo-300"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/Sanket-Thorat99"
              className="transition hover:text-indigo-700 dark:hover:text-indigo-300"
            >
              GitHub
            </a>
            <a
              href="#"
              className="transition hover:text-indigo-700 dark:hover:text-indigo-300"
            >
              Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
