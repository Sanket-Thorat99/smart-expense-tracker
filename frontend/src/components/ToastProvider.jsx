import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

const ToastContext = createContext(null);

const typeStyles = {
  success: {
    ring: "ring-green-200 dark:ring-green-900/40",
    dot: "bg-green-500",
    title: "text-slate-900 dark:text-slate-50",
    body: "text-slate-600 dark:text-slate-300",
  },
  error: {
    ring: "ring-red-200 dark:ring-red-900/40",
    dot: "bg-red-500",
    title: "text-slate-900 dark:text-slate-50",
    body: "text-slate-600 dark:text-slate-300",
  },
  warning: {
    ring: "ring-yellow-200 dark:ring-yellow-900/40",
    dot: "bg-yellow-500",
    title: "text-slate-900 dark:text-slate-50",
    body: "text-slate-600 dark:text-slate-300",
  },
  info: {
    ring: "ring-indigo-200 dark:ring-indigo-900/40",
    dot: "bg-indigo-500",
    title: "text-slate-900 dark:text-slate-50",
    body: "text-slate-600 dark:text-slate-300",
  },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timeoutsRef = useRef(new Map());

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timeout = timeoutsRef.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeoutsRef.current.delete(id);
    }
  }, []);

  const pushToast = useCallback(
    ({ type = "info", title, message, durationMs = 2800 }) => {
      const id = crypto?.randomUUID?.() ?? String(Date.now() + Math.random());
      setToasts((prev) => [{ id, type, title, message }, ...prev].slice(0, 4));

      const timeout = setTimeout(() => removeToast(id), durationMs);
      timeoutsRef.current.set(id, timeout);

      return id;
    },
    [removeToast],
  );

  const value = useMemo(
    () => ({ pushToast, removeToast }),
    [pushToast, removeToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="fixed right-4 top-4 z-50 flex w-[min(420px,calc(100vw-2rem))] flex-col gap-2"
        role="region"
        aria-label="Notifications"
      >
        {toasts.map((t) => {
          const styles = typeStyles[t.type] ?? typeStyles.info;
          return (
            <div
              key={t.id}
              className={`card ring-1 ${styles.ring} overflow-hidden`}
              role="status"
              aria-live="polite"
            >
              <div className="flex items-start gap-3 p-3">
                <div
                  className={`mt-1 h-2.5 w-2.5 rounded-full ${styles.dot}`}
                />
                <div className="min-w-0 flex-1">
                  {t.title ? (
                    <p
                      className={`truncate text-sm font-semibold ${styles.title}`}
                    >
                      {t.title}
                    </p>
                  ) : null}
                  {t.message ? (
                    <p className={`mt-0.5 text-sm ${styles.body}`}>
                      {t.message}
                    </p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => removeToast(t.id)}
                  className="btn-ghost px-2 py-1 text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-100"
                  aria-label="Dismiss"
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within <ToastProvider />");
  }
  return ctx;
}
