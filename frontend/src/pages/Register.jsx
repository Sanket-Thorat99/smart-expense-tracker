import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ToastProvider";
import bg from "../assets/SavemoreBG.png";
import logo from "../assets/SaveMoreLogo.png";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { pushToast } = useToast();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", form);

      pushToast({
        type: "success",
        title: "Account created",
        message: "You can now sign in.",
      });

      navigate("/"); // go to login
    } catch (err) {
      console.log(err.response);
      pushToast({
        type: "error",
        title: "Registration failed",
        message: err.response?.data?.msg || "Please try again.",
      });
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden px-3 py-4 sm:px-6 sm:py-8">
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

      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-6xl items-stretch">
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
                  Create your
                  <br />
                  account, quickly.
                </h1>
                <p className="mt-3 max-w-md text-base text-slate-700 dark:text-slate-200">
                  Start tracking your expenses in minutes.
                </p>
              </section>

              <section className="mx-auto w-full max-w-md">
                <form
                  onSubmit={handleSubmit}
                  className="rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-950/70"
                >
                  <h2 className="text-center text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
                    Create account
                  </h2>

                  <div className="mt-5">
                    <label
                      htmlFor="name"
                      className="text-sm font-semibold text-slate-800 dark:text-slate-200"
                    >
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      placeholder="Your name"
                      value={form.name}
                      onChange={handleChange}
                      className="input mt-2 focus:border-indigo-500 focus:ring-indigo-100 dark:focus:ring-indigo-900/40"
                      required
                    />
                  </div>

                  <div className="mt-4">
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

                  <button
                    type="submit"
                    className="mt-6 w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-indigo-700 active:bg-indigo-800"
                  >
                    Register
                  </button>

                  <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-300">
                    Already have an account?{" "}
                    <span
                      onClick={() => navigate("/")}
                      className="cursor-pointer font-semibold text-indigo-700 hover:underline dark:text-indigo-300"
                    >
                      Sign in
                    </span>
                  </p>
                </form>
              </section>
            </div>
          </main>

          <footer className="px-5 pb-5 text-center text-sm text-slate-600 dark:text-slate-300 sm:px-8">
            © {new Date().getFullYear()} SaveMore. All rights reserved. | Terms
            | Privacy | Contact
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Register;
