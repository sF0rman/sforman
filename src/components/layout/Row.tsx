import { ReactElement } from "react";
import "./Layout.scss";

interface RowProps {
  children: ReactElement;
}
const Row = ({ children }: RowProps) => {
  return <div className="row">{children}</div>;
};

export default Row;
