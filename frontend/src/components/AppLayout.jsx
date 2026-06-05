import NavBar from "./NavBar";
import Footer from "./Footer";
import bg from "../assets/SavemoreBG.png";

export default function AppLayout({ children }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div aria-hidden="true" className="absolute inset-0 -z-10 h-full w-full">
        <img
          src={bg}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-white/55 dark:bg-slate-950/55" />
      </div>
      <NavBar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-10 pt-6 sm:px-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}
