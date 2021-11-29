import useTheme from "../../hooks/useTheme";
import Toggle from "../toggle/Toggle";
import "./ThemeController.scss";

const ThemeController = () => {
  const theme = useTheme();

  const toggleTheme = (value: boolean) => {
    theme.setTheme(value ? "dark" : "light");
  };
  return (
    <div className="theme-controller">
      <i className="fas fa-sun" />
      <Toggle value={theme.value === "dark"} onChange={toggleTheme} />
      <i className="fas fa-moon" />
    </div>
  );
};

export default ThemeController;
