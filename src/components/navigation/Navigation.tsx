import { Link } from "react-router-dom";
import useTheme from "../hooks/useTheme";
import Switch from "../switch/Switch";

const Navigation = () => {
  const theme = useTheme();

  const toggleTheme = (value: boolean) => {
    theme.setTheme(value ? "dark" : "light");
  };

  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/cv">CV</Link>
      <Link to="/portfolio">Portfolio</Link>
      <Link to="/portfolio/item">Item</Link>
      <Link to="/cv/item">cvItem</Link>
      <Switch value={theme.value === "dark"} onChange={toggleTheme} />
    </nav>
  );
};

export default Navigation;
