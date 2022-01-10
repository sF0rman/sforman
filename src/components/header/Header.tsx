import "./Header.scss";
import Logo_darkmode from "../../resources/img/logo_dark.svg";
import Logo_lightmode from "../../resources/img/logo_light.svg";
import useTheme from "../../hooks/useTheme";

const Header = () => {
  const theme = useTheme();
  return (
    <div className="header">
      <div className="header-title">
        <div className="logo-wrapper">
          <img src={theme.value === "dark" ? Logo_darkmode : Logo_lightmode} alt="S" />
        </div>
        <h1 className="header-title-text">
          <span className="h1">Sebastian Forman</span>
          <span className="h2">Full Stack Developer</span>
        </h1>
      </div>
      <div className="header-content">
        <h2 className="h3">Site under construction</h2>
        <div className="header-content-links">
          <a href="https://github.com/sF0rman" target="_blank">
            <i className="fab fa-github" /> Github
          </a>
          <a href="https://www.linkedin.com/in/sebastianforman/" target="_blank">
            <i className="fab fa-linkedin" /> LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
};

export default Header;
