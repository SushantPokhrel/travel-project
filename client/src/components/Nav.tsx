import { useEffect, useState } from "react";
import { Equal, X, Sun, Moon, User as UserIcon } from "lucide-react";
import guideNepalLogo from "@/assets/guideNepal_logo.jpg";
import { Link, NavLink, useLocation } from "react-router";
import Button from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { useStore } from "@/store/useStore";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Find Guides", to: "/guides" },
  { label: "How it Works", to: "/how-it-works" },
  { label: "Templates", to: "/templates" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export default function Nav() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const location = useLocation();
  const user = useStore((state) => state.user);

  useEffect(() => {
    setIsNavOpen(false);
  }, [location.pathname]);

  const closeMenu = () => setIsNavOpen(false);

  return (
    <header className="">
      {/* mobile and small screen nav */}
      <nav className="small-screens w-full lg:hidden border-b border-b-gray-1 fixed h-16 px-5 flex bg-body-bg text-text-para justify-between z-50 items-center">
        <Link
          to="/"
          onClick={closeMenu}
          className="flex gap-2.5 items-center hover:opacity-80 active:scale-95 transition-all"
        >
          <img
            src={guideNepalLogo}
            className="h-10 aspect-square rounded-full"
            alt="logo"
          />{" "}
          <h1 className="font-bold ">
            <span className="text-primary">Guide</span>
            <span className="text-secondary">Nepal</span>
          </h1>
        </Link>
        <div
          className="cursor-pointer p-2 -mr-2 rounded-xl hover:bg-primary/10 active:bg-primary/20 active:scale-95 transition-all"
          onClick={() => setIsNavOpen((prev) => !prev)}
        >
          {isNavOpen ? <X size={22} /> : <Equal size={25} />}
        </div>
      </nav>
      {/* Pass closeMenu down as onClose */}
      <NavLinksMenuMobile isNavOpen={isNavOpen} onClose={closeMenu} user={user} />
      {/*--------- Large desktop screen nav --------*/}
      <nav className="large-screens hidden lg:flex h-16 bg-body-bg text-text-para border-b border-b-gray-1 fixed top-0 w-full justify-between z-50 px-8 items-center">
        {/* Left side: Brand Logo & Title */}
        <Link to="/" className="flex gap-2.5 items-center">
          <img
            src={guideNepalLogo}
            className="h-10 aspect-square rounded-full"
            alt="logo"
          />
          <h1 className="font-bold text-lg">
            <span className="text-primary">Guide</span>
            <span className="text-secondary">Nepal</span>
          </h1>
        </Link>

        {/* Center side: Nav links mapped horizontally */}
        <ul className="flex items-center gap-4 text-sm font-medium">
          <NavLinksDesktop />
        </ul>

        {/* Right side: Theme toggle + Authentication buttons / Profile */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {user ? (
            <Link
              to="/dashboard"
              className="p-2 rounded-full border border-gray-1 bg-surface hover:bg-gray-1/50 transition-all flex items-center justify-center"
              title="Profile"
            >
              <UserIcon size={20} className="text-text-para" />
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                href="/auth"
                className="bg-surface font-medium text-sm text-text-para border border-gray-1 px-5 py-2 hover:bg-gray-1/50"
              >
                Login
              </Button>
              <Button
                href="/auth"
                className="bg-primary text-white px-5 py-2 text-sm font-medium"
              >
                Sign up
              </Button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

type NavLinksMenuMobileProps = {
  isNavOpen: boolean;
  onClose: () => void;
  user: any;
};
//dvh => actual browser viewport height excluding mobile bottom nav and address bar at top
function NavLinksMenuMobile({ isNavOpen, onClose, user }: NavLinksMenuMobileProps) {
  return (
    <div
      className={`fixed z-40 bg-body-bg text-text-para flex flex-col gap-4.5 ${
        isNavOpen
          ? "top-16 h-[calc(100dvh-4rem)] overflow-y-auto py-14"
          : "-top-[100vh]"
      } transition-all duration-400 ease-in w-full right-0 lg:hidden`}
    >
      <ul className="text-sm flex flex-col w-75 mx-auto">
        <NavLinksMobile onClose={onClose} />
      </ul>
      <div className="auth-btn-container w-75 mx-auto flex flex-col gap-3 items-center">
        {user ? (
          <Link
            to="/dashboard"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full p-3 rounded-lg border border-gray-1 bg-surface hover:bg-gray-1/50 active:scale-95 transition-all"
          >
            <UserIcon size={20} className="text-text-para" />
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
        ) : (
          <>
            <Button
              href="/auth"
              className="bg-surface text-text-para border border-gray-1 hover:bg-gray-1/50 active:scale-95 transition-all w-full"
              onClose={onClose}
            >
              Login
            </Button>
            <Button
              href="/auth"
              className="w-full active:scale-95 transition-all"
              onClose={onClose}
            >
              Sign Up
            </Button>
          </>
        )}
      </div>
      <div className="flex justify-center">
        <ThemeToggle />
      </div>
    </div>
  );
}

type NavLinksProps = {
  onClose: () => void;
};

//  Mobile Link Renderer
function NavLinksMobile({ onClose }: NavLinksProps) {
  return (
    <>
      {NAV_LINKS.map((link) => (
        <li
          key={link.label}
          className={
            "py-3 border-b border-b-gray-1 hover:bg-primary/10 active:bg-primary/20 active:scale-[0.98] rounded-lg transition-all"
          }
        >
          <NavLink
            to={link.to}
            onClick={onClose}
            className={({ isActive }) =>
              `block w-full ${isActive ? "text-primary" : ""}`
            }
          >
            {link.label}
          </NavLink>
        </li>
      ))}
    </>
  );
}

//Desktop Link Renderer
function NavLinksDesktop() {
  return (
    <>
      {NAV_LINKS.map((link) => {
        return (
          <li key={link.label}>
            <NavLink
              to={link.to}
              end
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-full tracking-tight font-medium transition-all duration-400 ease-in-out ${
                  isActive
                    ? "bg-primary/80 text-white"
                    : "hover:text-white  hover:bg-primary "
                }`
              }
            >
              {link.label}
            </NavLink>
          </li>
        );
      })}
    </>
  );
}

// Sun/Moon slider toggle for switching between light and dark theme
function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <button
      onClick={() =>
        setTheme((currentTheme) => {
          if (currentTheme == "light") return "dark";
          return "light";
        })
      }
      className="cursor-pointer h-7 w-14 relative bg-gray-1 border border-gray-1 inline-block rounded-3xl hover:bg-primary/30 active:scale-95 transition-all"
    >
      <span
        className={`absolute top-1/2 left-0.5 -translate-y-1/2 transition-transform ${
          theme == "dark" ? "translate-x-7" : "translate-x-0"
        }`}
      >
        {theme == "dark" ? (
          <Moon size="22" className="bg-body-bg p-1 rounded-full" />
        ) : (
          <Sun size="22" className="bg-body-bg p-1 rounded-full" />
        )}
      </span>
    </button>
  );
}