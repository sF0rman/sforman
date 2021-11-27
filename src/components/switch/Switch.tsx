import { MouseEvent, ReactElement } from "react";
import "./Switch.scss";

interface SwitchProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

const Switch = ({ value, onChange }: SwitchProps): ReactElement => {
  const buildClass = () => {
    const classList: string[] = [];
    value && classList.push("active");
    return classList.join(" ");
  };

  const toggle = (e: MouseEvent<HTMLButtonElement>) => {
    onChange(!value);
  };
  return (
    <button className={`switch ${buildClass()}`} onClick={toggle}>
      <div className="switch-dot"></div>
    </button>
  );
};

export default Switch;
