import { themes } from "@/CONST/theme";
import { ThemeContext } from "@/contexts/ThemeContext";
import { useContext } from "react";

export function useTheme() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const colors = themes[theme as keyof typeof themes];

  return {
    theme,
    toggleTheme,
    colors,
  };
}
