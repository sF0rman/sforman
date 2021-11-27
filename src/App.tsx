import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./App.scss";
import Console from "./components/console/Console";
import Switch from "./components/switch/Switch";

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

const App = () => {
  const [theme, setTheme] = useState<Theme>(findTheme());
  useEffect(() => {
    findTheme();
  }, []);

  const changeTheme = (value: boolean) => {
    const theme: Theme = value ? "dark" : "light";
    localStorage.setItem("data-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    setTheme(theme);
  };

  return (
    <div className="app">
      <Switch value={theme === "dark"} onChange={changeTheme} />
      Its working
      <Link to="/">Home</Link>
      <Link to="/cv">CV</Link>
      <Link to="/portfolio">Portfolio</Link>
      <Link to="/portfolio/item">Item</Link>
      <Link to="/cv/item">cvItem</Link>
      <Console />
    </div>
  );
};

export default App;
