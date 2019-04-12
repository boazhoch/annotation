import React from "react";
import { Rect, Text } from "react-konva";
import { Shape } from "konva/types/Shape";
import { Stage } from "konva/types/Stage";
import { IShapeProps } from "../../services/Shape/IShape";

interface IProps extends IShapeProps {
  onTransform: onTransform;
  onDragEnd: onTransform;
}

interface IState {
  x: number;
  y: number;
}

type onTransform = ({
  size,
  coords,
  text,
  stroke,
  id,
  name
}: {
  name: string;
  id: string;
  stroke: string;
  text?: string;
  coords: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
}) => void;

function isShape(S: Shape | Stage): S is Shape {
  return (S as Shape).stroke !== undefined;
}

class Rectangle extends React.Component<IProps, IState> {
  private rect: any;

  state: IState = {
    x: 0,
    y: 0
  };

  componentDidUpdate() {
    this.rect.getLayer().batchDraw();
  }

  handleChange = (shape: any) => {
    this.props.onTransform({
      stroke: this.props.stroke,
      text: this.props.text,
      name: this.props.name,
      id: this.props.id,
      size: {
        width: shape.width(),
        height: shape.height()
      },
      coords: {
        x: shape.x(),
        y: shape.y()
      }
    });
  };

  render() {
    const {
      props: { size, coords, name, stroke, id },
      handleChange
    } = this;
    const textCoords = this.rect && this.rect.getClientRect();
    return (
      <>
        <Rect
          x={coords.x}
          y={coords.y}
          width={size.width}
          height={size.height}
          stroke={stroke}
          strokeWidth={2}
          name={name}
          id={id}
          onTransform={e => {
            handleChange(e.currentTarget);
          }}
          onDragMove={e => {
            handleChange(e.currentTarget);
          }}
          draggable
          ref={node => {
            if (node) {
              this.rect = node;
            }
          }}
        />
        {this.props.text && (
          <Text
            x={(textCoords || {}).x || 0}
            y={((textCoords || {}).y || 0) - 15}
            fontSize={15}
            fill={"#FFF"}
            text={this.props.text}
          />
        )}
      </>
    );
  }
}

export default Rectangle;
