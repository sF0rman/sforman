import "./Header.scss";
import Logo_darkmode from "../../resources/img/logo_v2.svg";
import Logo_lightmode from "../../resources/img/logo.svg";
import useTheme from "../../hooks/useTheme";

const Header = () => {
  const theme = useTheme();
  return (
    <div className="header">
      <div className="logo-wrapper">
        <img src={theme.value === "dark" ? Logo_darkmode : Logo_lightmode} alt="S" />
      </div>
      <h1 className="header-text">
        <span className="h1">Sebastian Forman</span>
        <span className="h2">Full Stack Developer</span>
      </h1>
    </div>
  );
};

export default Header;
