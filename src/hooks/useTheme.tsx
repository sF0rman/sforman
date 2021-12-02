import { useState, useEffect, ReactElement } from "react";

export type Theme = "system" | "dark" | "light";

const findTheme = (): Theme => {
  let theme: Theme = (localStorage.getItem("data-theme") as Theme) ?? "system";
  if (theme === "system") {
    if (!!window.matchMedia) {
      theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } else {
      theme = "light";
    }
  }
  localStorage.setItem("data-theme", theme);
  document.documentElement.setAttribute("data-theme", theme);
  return theme;
};

const useTheme = () => {
  const [value, setValue] = useState<Theme>(findTheme());

  const setTheme = (theme: string): boolean => {
    switch (theme as Theme) {
      case "dark":
      case "light":
        setValue(theme as Theme);
        return true;
      default:
        return false;
    }
  };

  useEffect(() => {
    localStorage.setItem("data-theme", value as string);
    document.documentElement.setAttribute("data-theme", value);
  }, [value]);

  return { value, setTheme };
};

export default useTheme;
