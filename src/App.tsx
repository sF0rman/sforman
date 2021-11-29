import { Route, Routes } from "react-router-dom";
import "./App.scss";
import Console from "./components/console/Console";
import Navigation from "./components/navigation/Navigation";
import ThemeController from "./components/theme/ThemeController";
import HomePage from "./pages/HomePage";
import StylePage from "./pages/StylePage";

const App = () => {
  return (
    <div className="app">
      <Navigation />
      <ThemeController />
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="cv" element={<>CV</>}>
          <Route path=":id" element={<>Cv item</>} />
        </Route>
        <Route path="portfolio" element={<>Portfolio</>}>
          <Route path=":id" element={<>Portfolio item</>} />
        </Route>
        <Route path="style" element={<StylePage />} />
        <Route path="*" element={<>Page doesn't exist</>} />
      </Routes>
      <Console />
    </div>
  );
};

export default App;
