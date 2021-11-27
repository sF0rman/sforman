import { KeyboardEvent, ReactElement, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useRoutes } from "react-router";
import useTheme from "../hooks/useTheme";

import "./Console.scss";

interface ConsoleHistory {
  path?: string;
  cmd?: string;
  error?: boolean;
  message?: any;
}

const HELP_MESSAGE: ReactElement = (
  <span className="console-help">
    cd &lt;path&gt; - navigate on site
    <br />
    goto &lt;url&gt; - open another link <br />
    theme &lt;dark|light&gt; - sets theme clear - clears console <br />
    clear - clears the console
  </span>
);
const THEME_CHANGED_SUCCESS: ReactElement = <p>Successfully changed theme...</p>;
const THEME_CHANGED_ERROR: ReactElement = <p>Unable to change theme. Allowed themes are 'light' or 'dark'</p>;
const createGotoMessage = (value: string): ReactElement => {
  return <>Opening {value}</>;
};
const createErrorMessage = (value: string): ReactElement => {
  return (
    <>
      Unknown command: {value}
      <br />
      Use command 'help' to show available commands.
    </>
  );
};

const Console = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [history, setHistory] = useState<ConsoleHistory[]>([]);
  const theme = useTheme();

  const consoleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    updateHistory();
  }, [location]);

  useEffect(() => {
    consoleRef.current?.focus();
  }, [history]);

  const updateHistory = (): void => {
    const hasPathChanged = location.pathname !== history[history.length - 1]?.path ?? false;
    // create new entry for history
    if (hasPathChanged) {
      const current: ConsoleHistory = {
        path: hasPathChanged ? location.pathname : undefined,
        cmd: undefined,
      };

      // get history as is and update cmd for last item
      const his = history;
      let lastHistory = his[his.length - 1];
      if (lastHistory) {
        lastHistory.cmd = getCmd();
        his[his.length - 1] = lastHistory;
      }

      setHistory([...his, current]);
    }
  };

  const getCmd = (): string | undefined => {
    const his = history[history.length - 1]?.path?.split("/") ?? undefined;
    const loc = location.pathname.split("/");
    let compare = [];
    if (his) {
      console.log("history", his);
      for (let i = 0; i < Math.max(his?.length ?? 0, loc.length); i++) {
        compare.push({
          history: his ? his[i] ?? "" : "",
          location: loc[i],
        });
      }

      let cmd: string[] = [];
      let path: string[] = [];
      compare.forEach(compare => {
        console.log(compare.history, compare.location);
        if (compare.history !== compare.location && !cmd.includes("cd .")) {
          cmd.push("cd .");
        }
        if (cmd.includes("cd .")) {
          compare.history && cmd.push("/..");
          compare.location && path.push(`/${compare.location}`);
        }
      });
      path.map(p => cmd.push(p));
      return cmd.join("");
    }
    return undefined;
  };

  const addConsoleEvent = (cmd: string, message: ReactElement, error: boolean): void => {
    const his = history;
    let lastHistory = his[his.length - 1];
    if (lastHistory) {
      lastHistory.cmd = cmd;
      his[his.length - 1] = lastHistory;
    }
    setHistory([...his, { message, error }, { path: location.pathname }]);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const value = e.currentTarget.value.toLowerCase();
      if (value === "help") {
        addConsoleEvent(value, HELP_MESSAGE, false);
      } else if (value.startsWith("cd ")) {
        let target = value.replace("cd ", "");
        navigate(target.startsWith("..") ? `./${target}` : target);
      } else if (value.startsWith("theme ")) {
        let target = value.replace("theme ", "");
        const completed = theme.setTheme(target);
        addConsoleEvent(value, completed ? THEME_CHANGED_SUCCESS : THEME_CHANGED_ERROR, !completed);
      } else if (value === "clear") {
        setHistory([{ path: location.pathname }]);
        consoleRef.current?.setAttribute("value", "");
      } else if (value.startsWith("goto ")) {
        const regex = /https?:\/\/(www\.)?[\w\d]+\.\w+/g;
        const final = /https?:\/\/(www\.)[\w\d]+\.(\w+)/g;
        const start = /https?:\/\//;
        let target = value.replace("goto ", "");
        if (!target.match(regex)) {
          target = target.match(start) ? target : `http://www.${target}`;
          target = target.match(final) ? target : `${target}.com`;
        }
        window.open(target);
        addConsoleEvent(value, createGotoMessage(target), false);
      } else {
        addConsoleEvent(value, createErrorMessage(value), true);
      }
    }
  };

  return (
    <div className="console">
      {history.map((h, i) => (
        <span key={`console-item-${i}`} className={`console-line${h.error ? " console-error" : ""}`}>
          <p>{h.message ? h.message : `www/sforman${h.path ?? ""}> ${h.cmd ?? ""}`}</p>
          {i === history.length - 1 && <input className="console-input" ref={consoleRef} onKeyDown={handleKeyDown} />}
        </span>
      ))}
      <div className="console-overlay"></div>
    </div>
  );
};

export default Console;
