import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const KEY = "booth-theme";
const ThemeContext = createContext({ theme: "light", toggleTheme: () => {} });

/** `?theme=dark` / `?theme=light` anywhere in the URL wins over the stored choice. */
function initialTheme() {
  if (typeof window === "undefined") return "light";
  const m = window.location.href.match(/[?&]theme=(dark|light)\b/);
  if (m) return m[1];
  try {
    return localStorage.getItem(KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(initialTheme);

  useEffect(() => {
    // On <html> so page-level backgrounds (html, body, #root) pick up the dark tokens too.
    document.documentElement.classList.toggle("theme-dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
    try {
      localStorage.setItem(KEY, theme);
    } catch {
      /* private mode: theme lasts for this session only */
    }
  }, [theme]);

  const toggleTheme = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
