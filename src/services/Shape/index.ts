import IShape, { IShapeProps } from "./IShape";

class Shape implements IShape {
  public props: IShapeProps;

  constructor(props: IShapeProps) {
    this.props = props;
  }

  getCoords() {
    return this.props.coords;
  }

  update(props: IShapeProps) {
    this.props = props;
  }
}

export default Shape;
