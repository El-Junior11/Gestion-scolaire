import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useTheme } from "../context/ThemeContext";

export default function AppLayout({ children }) {
  const { isDark } = useTheme();

  return (
    <div className={`flex h-screen overflow-hidden ${isDark ? "dark bg-ink-dark" : "bg-paper"}`}>
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-8 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
