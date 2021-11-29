import { Link } from "react-router-dom";
import useTheme from "../../hooks/useTheme";
import Switch from "../switch/Switch";

import "./Navigation.scss";

const Navigation = () => {
  return (
    <nav className="main-navigation">
      <Link to="/">Home</Link>
      <Link to="/cv">CV</Link>
      <Link to="/portfolio">Portfolio</Link>
      <Link to="/portfolio/item">Item</Link>
      <Link to="/cv/item">cvItem</Link>
    </nav>
  );
};

export default Navigation;
