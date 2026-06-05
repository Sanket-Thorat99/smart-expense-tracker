import { useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../services/api";
import { useToast } from "../components/ToastProvider";
import Footer from "../components/Footer";
import bg from "../assets/SavemoreBG.png";
import logo from "../assets/SaveMoreLogo.png";

const Login = () => {
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      pushToast({
        type: "success",
        title: "Welcome back",
        message: "Login successful.",
      });

      navigate("/dashboard");
    } catch (err) {
      console.log(err.response);
      const msg = err.response?.data?.msg || "Login failed";
      setError(msg);
      pushToast({ type: "error", title: "Login failed", message: msg });
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden px-3 py-4 sm:px-6 sm:py-8">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <img
          src={bg}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-white/55 dark:bg-slate-950/55" />
        <div className="absolute inset-0 bg-gradient-to-br from-sky-100/40 via-white/10 to-indigo-100/40 dark:from-sky-950/30 dark:via-slate-950/20 dark:to-indigo-950/30" />
      </div>

      <div className="mx-auto flex flex-1 w-full max-w-6xl items-stretch">
        <div className="flex w-full flex-col rounded-3xl border border-slate-200/60 bg-white/55 shadow-lg backdrop-blur dark:border-slate-800/60 dark:bg-slate-950/45">
          <header className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-8 sm:py-5">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex items-center gap-3 rounded-2xl px-2 py-1 text-left transition hover:bg-white/60 dark:hover:bg-slate-900/40"
              aria-label="Go to home"
            >
              <img src={logo} alt="SaveMore Logo" className="h-9 w-9" />
              <p className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
                SaveMore
              </p>
            </button>

            <nav className="flex items-center gap-4 text-sm font-semibold">
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="rounded-xl px-3 py-2 text-slate-600 transition hover:bg-white/60 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900/40 dark:hover:text-slate-50"
              >
                About
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="rounded-xl px-3 py-2 text-slate-600 transition hover:bg-white/60 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900/40 dark:hover:text-slate-50"
              >
                Pricing
              </a>
            </nav>
          </header>

          <main className="flex flex-1 items-center px-5 pb-8 pt-2 sm:px-8 sm:pb-10">
            <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
              <section className="max-w-xl">
                <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
                  Manage your
                  <br />
                  expenses, easily.
                </h1>
                <p className="mt-3 max-w-md text-base text-slate-700 dark:text-slate-200">
                  Log in to your Smart Expense Tracker account.
                </p>
              </section>

              <section className="mx-auto w-full max-w-md">
                <form
                  onSubmit={handleSubmit}
                  className="rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-950/70"
                >
                  <h2 className="text-center text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
                    Sign In
                  </h2>

                  {error && (
                    <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 dark:bg-red-950/40 dark:text-red-200">
                      {error}
                    </p>
                  )}

                  <div className="mt-5">
                    <label
                      htmlFor="email"
                      className="text-sm font-semibold text-slate-800 dark:text-slate-200"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="your.email@example.com"
                      value={form.email}
                      onChange={handleChange}
                      className="input mt-2 focus:border-indigo-500 focus:ring-indigo-100 dark:focus:ring-indigo-900/40"
                      required
                    />
                  </div>

                  <div className="mt-4">
                    <label
                      htmlFor="password"
                      className="text-sm font-semibold text-slate-800 dark:text-slate-200"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={handleChange}
                      className="input mt-2 focus:border-indigo-500 focus:ring-indigo-100 dark:focus:ring-indigo-900/40"
                      required
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:focus:ring-indigo-900/40"
                      />
                      Remember Me
                    </label>

                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="text-sm font-semibold text-indigo-700 hover:underline dark:text-indigo-300"
                    >
                      Forgot Password?
                    </a>
                  </div>

                  <button
                    type="submit"
                    className="mt-6 w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-indigo-700 active:bg-indigo-800"
                  >
                    Log In
                  </button>

                  <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-300">
                    New here?{" "}
                    <span
                      onClick={() => navigate("/register")}
                      className="cursor-pointer font-semibold text-indigo-700 hover:underline dark:text-indigo-300"
                    >
                      Create account
                    </span>
                  </p>
                </form>
              </section>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
