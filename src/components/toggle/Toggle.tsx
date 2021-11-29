import { MouseEvent, ReactElement } from "react";
import "./Toggle.scss";

type ToggleDirection = "horizontal" | "vertical";

interface SwitchProps {
  value: boolean;
  onChange: (value: boolean) => void;
  direction?: ToggleDirection;
}

const Toggle = ({ value, onChange, direction }: SwitchProps): ReactElement => {
  const buildClass = () => {
    const classList: string[] = [];
    value && classList.push("active");
    if (direction === "vertical") {
      classList.push("vertical");
    } else {
      classList.push("horizontal");
    }
    return classList.join(" ");
  };

  const toggle = (e: MouseEvent<HTMLButtonElement>) => {
    onChange(!value);
  };
  return (
    <button className={`toggle ${buildClass()}`} onClick={toggle}>
      <div className="toggle-dot"></div>
    </button>
  );
};

export default Toggle;
