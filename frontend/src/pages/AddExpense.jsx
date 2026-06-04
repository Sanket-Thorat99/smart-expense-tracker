import { useMemo, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ToastProvider";

const AddExpense = () => {
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "",
    isNecessary: true,
  });

  const categories = useMemo(
    () => [
      "Food",
      "Transport",
      "Bills",
      "Shopping",
      "Entertainment",
      "Healthcare",
      "Education",
      "Other",
    ],
    [],
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      await API.post("/transactions", {
        ...form,
        amount: Number(form.amount),
      });

      pushToast({
        type: "success",
        title: form.type === "expense" ? "Expense added" : "Income added",
        message: "Transaction saved successfully.",
      });

      navigate("/dashboard");
    } catch (err) {
      console.log(err.response);
      pushToast({
        type: "error",
        title: "Couldn’t save transaction",
        message: err.response?.data?.msg || "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-200">
          Add transaction
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
          Add Expense
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Log an expense or income entry with category and necessity.
        </p>

        <div className="card mt-6 p-5">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Quick tips
          </p>
          <ul className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li>Use categories to improve chart insights.</li>
            <li>Mark unnecessary spends to spot leaks.</li>
            <li>Keep titles short for a clean list.</li>
          </ul>
        </div>
      </div>

      <div className="lg:col-span-3">
        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Title
                </label>
                <div className="relative mt-2">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20 12V7a2 2 0 0 0-2-2h-5" />
                      <path d="M4 12V7a2 2 0 0 1 2-2h5" />
                      <path d="M4 12v5a2 2 0 0 0 2 2h5" />
                      <path d="M20 12v5a2 2 0 0 1-2 2h-5" />
                    </svg>
                  </span>
                  <input
                    name="title"
                    placeholder="e.g., Groceries"
                    value={form.title}
                    onChange={handleChange}
                    className="input pl-9"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Amount
                </label>
                <div className="relative mt-2">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                    ₹
                  </span>
                  <input
                    name="amount"
                    inputMode="decimal"
                    placeholder="0"
                    value={form.amount}
                    onChange={handleChange}
                    className="input pl-8"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Type
                </label>
                <div className="relative mt-2">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M7 7h10" />
                      <path d="M7 12h10" />
                      <path d="M7 17h10" />
                    </svg>
                  </span>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="select pl-9"
                    required
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Category
                </label>
                <div className="relative mt-2">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
                      <path d="M12 10.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                    </svg>
                  </span>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="select pl-9"
                    required
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="card p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                    Necessity
                  </p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    Mark if this spend was necessary.
                  </p>
                </div>

                <div className="flex rounded-2xl bg-slate-100 p-1 dark:bg-slate-800/60">
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, isNecessary: true }))
                    }
                    className={
                      form.isNecessary
                        ? "btn bg-white text-slate-900 shadow-sm px-4 py-2 dark:bg-slate-900 dark:text-slate-50"
                        : "btn bg-transparent text-slate-600 hover:bg-white/60 px-4 py-2 dark:text-slate-300 dark:hover:bg-slate-900/40"
                    }
                  >
                    Necessary
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, isNecessary: false }))
                    }
                    className={
                      !form.isNecessary
                        ? "btn bg-white text-slate-900 shadow-sm px-4 py-2 dark:bg-slate-900 dark:text-slate-50"
                        : "btn bg-transparent text-slate-600 hover:bg-white/60 px-4 py-2 dark:text-slate-300 dark:hover:bg-slate-900/40"
                    }
                  >
                    Unnecessary
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="btn-ghost"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving…" : "Save Transaction"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddExpense;
