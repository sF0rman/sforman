import { useState, useEffect, ReactElement } from "react";

type Theme = "system" | "dark" | "light";

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
        localStorage.setItem("data-theme", theme);
        document.documentElement.setAttribute("data-theme", theme);
        setValue(theme as Theme);
        return true;
      default:
        return false;
    }
  };

  useEffect(() => {
    setValue((localStorage.getItem("data-theme") as Theme) ?? "system");
  }, [localStorage.getItem("data-theme")]);

  return { value, setTheme };
};

export default useTheme;
