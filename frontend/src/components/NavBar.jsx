import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "./ToastProvider";
import { getCurrentTheme, toggleTheme } from "../utils/theme.js";
import logo from "../assets/SaveMoreLogo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const [theme, setTheme] = useState("light");

  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    setTheme(getCurrentTheme());
    const onThemeChange = () => setTheme(getCurrentTheme());
    window.addEventListener("themechange", onThemeChange);
    return () => window.removeEventListener("themechange", onThemeChange);
  }, []);

  const initials = useMemo(() => {
    const name = (user?.name || "User").trim();
    const parts = name.split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? "U";
    const second = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
    return (first + second).toUpperCase();
  }, [user?.name]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    pushToast({
      type: "info",
      title: "Signed out",
      message: "You’ve been logged out.",
    });
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    [
      "rounded-xl px-3 py-2 text-sm font-semibold transition",
      isActive
        ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-200"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-slate-50",
    ].join(" ");

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/70 backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/50">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 rounded-xl px-2 py-1 text-left transition hover:bg-slate-100 dark:hover:bg-slate-800/60"
          aria-label="Go to Dashboard"
        >
          <img src={logo} alt="SaveMore Logo" className="h-9 w-9" />
          <div className="leading-tight">
            <p className="text-sm font-extrabold text-slate-900 dark:text-slate-50">
              SaveMore
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Smart expense tracker
            </p>
          </div>
        </button>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/add" className={linkClass}>
              Add Expense
            </NavLink>
          </div>

          <button
            type="button"
            className="btn-ghost px-3 py-2"
            onClick={() => {
              const next = toggleTheme();
              setTheme(next);
              pushToast({
                type: "info",
                title: "Theme",
                message:
                  next === "dark"
                    ? "Dark mode enabled."
                    : "Light mode enabled.",
              });
            }}
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            title={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            <span
              className={
                theme === "dark"
                  ? "grid h-9 w-9 place-items-center rounded-xl bg-slate-800/70 text-yellow-300 transition"
                  : "grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-700 transition"
              }
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2a7 7 0 0 0-4 12c.6.4 1 1 1 1.7V18h6v-2.3c0-.7.4-1.3 1-1.7A7 7 0 0 0 12 2Z" />
                <path d="M9 22h6" />
              </svg>
            </span>
          </button>

          <div className="ml-2 flex items-center gap-2 rounded-2xl border border-slate-200/70 bg-white/70 px-2 py-1 dark:border-slate-800/70 dark:bg-slate-950/40">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-xs font-extrabold text-white">
              {initials}
            </div>
            <div className="hidden sm:block">
              <p className="max-w-[160px] truncate text-sm font-semibold text-slate-900 dark:text-slate-50">
                {user.name || "User"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Account
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="btn-ghost px-3 py-2"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
