import { Sun, Moon } from "lucide-react";
import useDarkMode from "../utils/useDarkMode";
 
export default function ThemeToggle() {
  const { isDark, toggleTheme } = useDarkMode();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-10 h-10 rounded-xl 
                 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700
                 transition-all duration-300 group border border-transparent 
                 hover:border-gray-300 dark:hover:border-gray-600 overflow-hidden"
      aria-label="Cambiar tema"
    >
      {/* Icono de Sol */}
      <Sun 
        className={`absolute h-5 w-5 text-yellow-500 transition-all duration-500 transform 
          ${isDark ? "translate-y-0 scale-100 rotate-0 opacity-100" : "translate-y-10 scale-0 -rotate-90 opacity-0"}`} 
      />
      
      {/* Icono de Luna */}
      <Moon 
        className={`absolute h-5 w-5 text-slate-700 dark:text-slate-400 transition-all duration-500 transform 
          ${!isDark ? "translate-y-0 scale-100 rotate-0 opacity-100" : "-translate-y-10 scale-0 rotate-90 opacity-0"}`} 
      />
    </button>
  );
}