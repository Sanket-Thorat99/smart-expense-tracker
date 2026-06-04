import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useToast } from "../components/ToastProvider";
import { getCurrentTheme } from "../utils/theme.js";

import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({});
  const [budget, setBudget] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    setTheme(getCurrentTheme());
    const onThemeChange = () => setTheme(getCurrentTheme());
    window.addEventListener("themechange", onThemeChange);
    return () => window.removeEventListener("themechange", onThemeChange);
  }, []);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const chartDataMonthly = useMemo(
    () => ({
      labels: monthlyData.map((d) => months[d._id - 1]),
      datasets: [
        {
          label: "Monthly spending",
          data: monthlyData.map((d) => d.total),
          borderColor: "#4f46e5",
          backgroundColor: "rgba(79,70,229,0.15)",
          pointRadius: 3,
          tension: 0.35,
          borderWidth: 2,
          fill: true,
        },
      ],
    }),
    [monthlyData],
  );

  const chartData = useMemo(
    () => ({
      labels: ["Necessary", "Unnecessary"],
      datasets: [
        {
          data: [
            (summary.totalExpense || 0) - (summary.unnecessaryExpense || 0),
            summary.unnecessaryExpense || 0,
          ],
          backgroundColor: ["rgba(34,197,94,0.35)", "rgba(239,68,68,0.35)"],
          borderColor: ["rgba(34,197,94,0.9)", "rgba(239,68,68,0.9)"],
          borderWidth: 1,
        },
      ],
    }),
    [summary.totalExpense, summary.unnecessaryExpense],
  );

  const remaining = Number(budget || 0) - (summary.totalExpense || 0);
  const budgetState = useMemo(() => {
    if (!budget || Number(budget) <= 0) return "unset";
    if (remaining < 0) return "over";
    if (remaining <= Number(budget) * 0.15) return "warn";
    return "good";
  }, [budget, remaining]);

  const loadDashboard = async () => {
    setIsLoading(true);
    try {
      const [res, summaryRes, monthlyRes] = await Promise.all([
        API.get("/transactions"),
        API.get("/transactions/summary"),
        API.get("/transactions/monthly"),
      ]);
      setTransactions(res.data);
      setSummary(summaryRes.data);
      setMonthlyData(monthlyRes.data);
    } catch (err) {
      console.log(err.response);
      pushToast({
        type: "error",
        title: "Couldn’t load dashboard",
        message: "Please check the backend server and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/transactions/${id}`);
      setTransactions((prev) => prev.filter((t) => t._id !== id));
      pushToast({
        type: "success",
        title: "Deleted",
        message: "Transaction removed.",
      });
      // refresh summary/charts
      loadDashboard();
    } catch (err) {
      console.error(err);
      pushToast({
        type: "error",
        title: "Delete failed",
        message: "Please try again.",
      });
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const budgetBanner =
    budgetState === "unset" ? null : budgetState === "over" ? (
      <div className="card p-4 ring-1 ring-red-200 dark:ring-red-900/40">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
          Budget exceeded
        </p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          You’re over by{" "}
          <span className="font-semibold text-red-600">
            ₹{Math.abs(remaining)}
          </span>
          . Consider reviewing unnecessary spend.
        </p>
      </div>
    ) : budgetState === "warn" ? (
      <div className="card p-4 ring-1 ring-yellow-200 dark:ring-yellow-900/40">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
          Budget is tight
        </p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Remaining{" "}
          <span className="font-semibold text-yellow-700">₹{remaining}</span>.
          You’re close to your monthly limit.
        </p>
      </div>
    ) : (
      <div className="card p-4 ring-1 ring-green-200 dark:ring-green-900/40">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
          On track
        </p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Remaining{" "}
          <span className="font-semibold text-green-700">₹{remaining}</span>.
          Keep it up.
        </p>
      </div>
    );

  const summaryCards = [
    {
      label: "Total expense",
      value: `₹${summary.totalExpense || 0}`,
      hint: "All expenses",
      accent: "text-red-600",
      dot: "bg-red-500",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 text-red-600"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 1v22" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      label: "Unnecessary spending",
      value: `₹${summary.unnecessaryExpense || 0}`,
      hint: `Saved potential: ₹${summary.unnecessaryExpense || 0}`,
      accent: "text-yellow-700",
      dot: "bg-yellow-500",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 text-yellow-700"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 2l9 16H3l9-16Z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
      ),
    },
    {
      label: "Budget remaining",
      value: budgetState === "unset" ? "—" : `₹${remaining}`,
      hint: budgetState === "unset" ? "Set a budget" : "This month",
      accent:
        budgetState === "over"
          ? "text-red-600"
          : budgetState === "warn"
            ? "text-yellow-700"
            : "text-green-700",
      dot:
        budgetState === "over"
          ? "bg-red-500"
          : budgetState === "warn"
            ? "bg-yellow-500"
            : "bg-green-500",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 text-indigo-700"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 6h18" />
          <path d="M7 12h10" />
          <path d="M10 18h4" />
        </svg>
      ),
    },
    {
      label: "Insight",
      value: summary.advice || "—",
      hint: "Personalized advice",
      accent: "text-slate-900 dark:text-slate-50",
      dot: "bg-indigo-500",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 text-indigo-700"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 2a7 7 0 0 0-4 12c.6.4 1 1 1 1.7V18h6v-2.3c0-.7.4-1.3 1-1.7A7 7 0 0 0 12 2Z" />
          <path d="M9 22h6" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-200">
            Dashboard
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
            Your spending at a glance
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Track expenses, spot leaks, and stay within budget.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/add")}
          className="btn-primary"
        >
          + Add Expense
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                Monthly budget
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Set a limit to get warnings as you spend.
              </p>
            </div>
            <div className="rounded-xl bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-200">
              {budgetState === "unset" ? "Not set" : `₹${budget}`}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <input
                type="number"
                inputMode="numeric"
                placeholder="Enter budget (e.g., 15000)"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="input"
              />
            </div>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => {
                setBudget(0);
                pushToast({
                  type: "info",
                  title: "Budget cleared",
                  message: "Budget tracking reset.",
                });
              }}
            >
              Clear
            </button>
          </div>
        </div>

        <div className="space-y-4">{budgetBanner}</div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((c) => (
          <div key={c.label} className="card card-hover p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-2xl bg-slate-50 dark:bg-slate-950/40">
                  {c.icon}
                </span>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  {c.label}
                </p>
              </div>
              <span className={`h-2.5 w-2.5 rounded-full ${c.dot}`} />
            </div>
            <div className="mt-3">
              <p
                className={`text-2xl font-extrabold tracking-tight ${c.accent}`}
              >
                {c.value}
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {c.hint}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                Necessary vs unnecessary
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Where your expenses are going.
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 dark:bg-slate-950/40 dark:text-slate-300">
              Pie
            </div>
          </div>

          <div className="mt-4 h-[280px]">
            {isLoading ? (
              <div className="h-full w-full animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800/60" />
            ) : (
              <Pie
                data={chartData}
                options={{
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: {
                        boxWidth: 10,
                        color: theme === "dark" ? "#e2e8f0" : "#475569",
                      },
                    },
                  },
                  maintainAspectRatio: false,
                }}
              />
            )}
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                Monthly trend
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Expenses over time (this year).
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 dark:bg-slate-950/40 dark:text-slate-300">
              Line
            </div>
          </div>

          <div className="mt-4 h-[280px]">
            {isLoading ? (
              <div className="h-full w-full animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800/60" />
            ) : (
              <Line
                data={chartDataMonthly}
                options={{
                  plugins: { legend: { display: false } },
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      grid: { display: false },
                      ticks: {
                        color: theme === "dark" ? "#cbd5e1" : "#64748b",
                      },
                    },
                    y: {
                      grid: {
                        color:
                          theme === "dark"
                            ? "rgba(148,163,184,0.18)"
                            : "rgba(148,163,184,0.25)",
                      },
                      ticks: {
                        precision: 0,
                        color: theme === "dark" ? "#cbd5e1" : "#64748b",
                      },
                    },
                  },
                }}
              />
            )}
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-slate-800/70 px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              Transactions
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Latest activity across income and expenses.
            </p>
          </div>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => loadDashboard()}
          >
            Refresh
          </button>
        </div>

        <div className="divide-y divide-slate-200/70 dark:divide-slate-800/60">
          {isLoading ? (
            <div className="p-5">
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="h-14 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800/60"
                  />
                ))}
              </div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                No transactions yet
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Add your first expense to start tracking.
              </p>
              <button
                type="button"
                className="btn-primary mt-4"
                onClick={() => navigate("/add")}
              >
                + Add Expense
              </button>
            </div>
          ) : (
            transactions.map((t) => {
              const isExpense = t.type === "expense";
              const dateLabel = t.createdAt
                ? new Date(t.createdAt).toLocaleDateString()
                : "";
              return (
                <div
                  key={t._id}
                  className="group flex flex-col gap-3 px-5 py-4 transition hover:bg-slate-50 dark:hover:bg-slate-800/40 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50">
                        {t.title}
                      </p>
                      {t.category ? (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-950/40 dark:text-slate-300">
                          {t.category}
                        </span>
                      ) : null}
                      <span
                        className={
                          t.isNecessary
                            ? "rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 dark:bg-green-950/40 dark:text-green-200"
                            : "rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 dark:bg-red-950/40 dark:text-red-200"
                        }
                      >
                        {t.isNecessary ? "Necessary" : "Unnecessary"}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {dateLabel}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <p
                      className={
                        isExpense
                          ? "text-sm font-extrabold text-red-600"
                          : "text-sm font-extrabold text-green-700"
                      }
                    >
                      {isExpense ? "-" : "+"}₹{t.amount}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="btn-ghost px-3 py-2"
                        onClick={() =>
                          pushToast({
                            type: "info",
                            title: "Edit",
                            message: "Editing is coming soon.",
                          })
                        }
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn-ghost px-3 py-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                        onClick={() => handleDelete(t._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
