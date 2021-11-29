import { ReactElement } from "react";
import { Gap } from "./Layout";
import "./Layout.scss";

interface ColProps {
  children: ReactElement;
  gap?: Gap;
}
const Col = ({ children, gap }: ColProps) => {
  const buildClass = () => {
    const classList: string[] = ["col"];
    gap && classList.push(`gap-${gap}`);
    return classList.join(" ");
  };
  return <div className={buildClass()}>{children}</div>;
};

export default Col;
