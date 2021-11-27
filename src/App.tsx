import "./App.scss";
import Console from "./components/console/Console";
import Navigation from "./components/navigation/Navigation";

const App = () => {
  return (
    <div className="app">
      <Navigation />
      <Console />
    </div>
  );
};

export default App;
