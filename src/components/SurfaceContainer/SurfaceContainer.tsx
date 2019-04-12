import React, { Component } from "react";
import { Stage, Layer } from "react-konva";
import Konva from "konva";
import { KonvaEventObject } from "konva/types/types";
import { Shape, ShapeConfig } from "konva/types/Shape";
import uuid from "uuid";

import Rectangle from "../RectContainer/RectContainer";
import TransformerComponent from "../Transformer/Transformer";
import style from "./SurfaceContainer.module.css";

import { ISurface } from "../../services/Surafce";
import { IHttp } from "../../services/http/IHttp";
import IShape, { IShapeProps } from "../../services/Shape/IShape";
import { INotifier } from "../../services/notification/INotifier";

function randomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

interface iState {
  newRectX: number;
  newRectY: number;
  element?: Shape<ShapeConfig> | Stage;
  currentShape: null | IShape;
  size?: {
    width: number;
    height: number;
  };
}

interface IProps {
  notifier: INotifier;
  surface: ISurface;
  requester: IHttp;
  renderProp(
    selected: IShape | null,
    onTitleChange: (id: string, arg: string) => void,
    onDelete: (selected: IShape) => void,
    onExport: () => void,
    buttonClassname: string
  ): JSX.Element;
}

class SurfaceContainer extends Component<IProps, iState> {
  private mouseDown = false;
  private stage: Konva.Stage | null;
  private mouseDraw = false;
  private stroke: string = "";
  private surface: ISurface;
  private requester: IHttp;
  private notifier: INotifier;

  constructor(props: IProps) {
    super(props);
    this.surface = props.surface;
    this.requester = props.requester;
    this.stage = null;
    this.notifier = props.notifier;
  }

  state: iState = {
    newRectX: 0,
    newRectY: 0,
    element: undefined,
    currentShape: null
  };

  // Also a process that divide to two parts:
  // 1: Detect if a shape was clicked
  // if a shape was clicked recognize if it a transformer ( the corner of the shape )
  // or wether it was the shape.
  // if its the transformer we do nothing.
  // if its the shape we set currentShape to be that shape.
  // if neither was clicked - prepare for drawing a new shape.
  onMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    this.mouseDown = true;
    const ele = e.target;

    if (ele && ele.parent && ele.parent.attrs.name === "transformer") {
      return;
    }

    if (ele.id()) {
      this.setState({
        currentShape:
          this.surface.getShapeById(ele.id()) || this.state.currentShape,
        element: (ele as Shape<ShapeConfig>) || this.state.element
      });
      return;
    }

    this.stroke = randomColor();

    const mousePos = this.getMousePos();

    this.setState({
      currentShape: null,
      element: undefined,
      newRectX: mousePos.x,
      newRectY: mousePos.y
    });
  };

  // Retrieve mouse position
  getMousePos() {
    return (this.stage as Konva.Stage).getPointerPosition();
  }

  // Handles the creation of a shape
  // The process is divided to two parts:
  // 1: Creating an object and make it with the shape factory.
  // 2: Once the shape is crafted just update this shape values as long as the mouse move.
  onMouseMove = () => {
    if (!this.mouseDown || this.state.element) {
      return;
    }

    const { newRectX, newRectY } = this.state;

    const mousePos = this.getMousePos();

    let obj = Object.assign(
      {},
      this.state.currentShape ? this.state.currentShape.props : {},
      {
        coords: {
          x: newRectX,
          y: newRectY
        },
        size: {
          width: mousePos.x - newRectX,
          height: mousePos.y - newRectY
        },
        stroke: this.state.currentShape
          ? this.state.currentShape.props.stroke
          : this.stroke,
        id: this.state.currentShape ? this.state.currentShape.props.id : "",
        name: this.state.currentShape ? this.state.currentShape.props.id : ""
      }
    );

    if (!this.mouseDraw && !this.state.currentShape) {
      const id = uuid.v4();
      obj.id = id;
      obj.name = id;

      this.setState({
        currentShape: this.surface.make("rect", obj as IShapeProps)
      });

      this.mouseDraw = true;
    }

    if (this.state.currentShape) {
      this.setState({
        currentShape: this.surface.updateShape(
          this.state.currentShape.props.id,
          obj
        )
      });
    }
  };

  // Clean ups, if a shape is smaller than 10*10 I consider it as a mistake therefore deleting it.
  onMouseUp = () => {
    this.mouseDraw = false;
    this.mouseDown = false;
    if (this.state.currentShape) {
      if (
        Math.abs(this.state.currentShape.props.size.width) <= 10 ||
        Math.abs(this.state.currentShape.props.size.height) <= 10
      ) {
        this.onDelete(this.state.currentShape);
      }
    }
  };

  // Handle shape update on each drag/transform etc.
  handleRectChange = (id: string, newProps: IShapeProps) => {
    this.setState({ currentShape: this.surface.updateShape(id, newProps) });
  };

  // Change shape text and update
  onTitleChange = (id: string, value: string) => {
    const shape = this.surface.getShapeById(id);
    if (shape) {
      this.setState({
        currentShape: this.surface.updateShape(shape.props.id, {
          ...shape.props,
          text: value
        })
      });
    }
  };

  // Delete a shape
  onDelete = (shape: IShape) => {
    this.surface.deleteShape(shape.props.id);
    this.setState({ currentShape: null, element: undefined });
  };

  onExport = () => {
    const shapes = [...this.surface.getShapes()];
    if (!shapes.length) {
      this.notifier.warning(
        "No Shapes available, please add a shape before exporting... 🤨"
      );
      return;
    }
    this.requester
      .post("/shapes", [...this.surface.getShapes()])
      .then(res => {
        this.notifier.success("The Data as been sent 🦄");
      })
      .catch(e => {
        this.notifier.error(
          "An Error occurred, please try again later 😓😒😨😩"
        );
      });
  };

  render() {
    return (
      <>
        <Stage
          width={(this.state.size || { width: undefined }).width || undefined}
          height={
            (this.state.size || { height: undefined }).height || undefined
          }
          ref={node => {
            this.stage = node && node.getStage();
            if (!this.state.size) {
              const sizes =
                this.stage && this.stage.content.getBoundingClientRect();
              if (sizes) {
                this.setState({
                  size: { width: sizes.width, height: sizes.height }
                });
              }
            }
          }}
          container="app"
          onMouseDown={this.onMouseDown}
          onMouseMove={this.onMouseMove}
          onMouseUp={this.onMouseUp}
        >
          <Layer>
            {[...this.surface.getShapes()].map(rect => (
              <Rectangle
                coords={rect.getCoords()}
                size={rect.props.size}
                text={rect.props.text}
                key={rect.props.id}
                id={rect.props.id}
                stroke={rect.props.stroke}
                name={rect.props.name}
                onTransform={(newProps: IShapeProps) => {
                  this.handleRectChange(rect.props.id, newProps);
                }}
                onDragEnd={(newProps: IShapeProps) => {
                  this.handleRectChange(rect.props.id, newProps);
                }}
              />
            ))}
            <TransformerComponent selected={this.state.element} />
          </Layer>
        </Stage>
        {this.props.renderProp(
          this.state.currentShape,
          this.onTitleChange,
          this.onDelete,
          this.onExport,
          style.button
        )}
      </>
    );
  }
}

export default SurfaceContainer;
