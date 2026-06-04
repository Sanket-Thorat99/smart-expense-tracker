const STORAGE_KEY = "theme";

export function getInitialTheme() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "dark" || stored === "light") return stored;
  const prefersDark = window.matchMedia?.(
    "(prefers-color-scheme: dark)",
  )?.matches;
  return prefersDark ? "dark" : "light";
}

export function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  localStorage.setItem(STORAGE_KEY, theme);
}

export function toggleTheme() {
  const isDark = document.documentElement.classList.contains("dark");
  const next = isDark ? "light" : "dark";
  applyTheme(next);
  window.dispatchEvent(
    new CustomEvent("themechange", { detail: { theme: next } }),
  );
  return next;
}

export function getCurrentTheme() {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}
