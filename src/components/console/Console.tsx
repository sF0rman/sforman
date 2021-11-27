import { KeyboardEvent, ReactElement, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useRoutes } from "react-router";

import "./Console.scss";

type CMD = "cd" | "goto" | "help";

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
    theme &lt;dark|light&gt; - sets theme clear - clears console
  </span>
);
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
      } else if (value === "clear") {
        setHistory([{ path: location.pathname }]);
        consoleRef.current?.setAttribute("value", "");
      } else if (value.startsWith("goto ")) {
        let target = value.replace("goto ", "");
        window.open(target);
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
