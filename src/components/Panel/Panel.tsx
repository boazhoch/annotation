import React, { Props, ReactNode } from "react";
import style from "./Panel.module.css";
import IShape from "../../services/Shape/IShape";

interface IPanelProps {
  options: string[];
  onTitleChange: (id: string, arg: string) => void;
  selectedShape: IShape;
  handleDelete(selected: IShape): void;
  children?: ReactNode;
}

const Panel: React.FunctionComponent<IPanelProps> = (props: IPanelProps) => (
  <div className={style["panel"]}>
    <div className="cards text-left">
      <div className="card">
        <div className="card-body">
          <p>id: {props.selectedShape.props.id}</p>
          <p>
            coords: X: {Math.floor(props.selectedShape.props.coords.x)} | Y:{" "}
            {Math.floor(props.selectedShape.props.coords.y)}
          </p>
          {props.options.map((el, i) => (
            <div key={i}>
              <button
                style={{
                  borderColor: props.selectedShape.props.stroke,
                  backgroundColor:
                    props.selectedShape.props.text === el
                      ? props.selectedShape.props.stroke
                      : ""
                }}
                className={
                  props.selectedShape.props.text === el ? "" : "outline"
                }
                onClick={e => {
                  props.onTitleChange(props.selectedShape.props.id, el);
                }}
              >
                {el}
              </button>
            </div>
          ))}
        </div>
        <div className="card-footer">
          <button
            onClick={e => {
              props.handleDelete(props.selectedShape);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default Panel;
