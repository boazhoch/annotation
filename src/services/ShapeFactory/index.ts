import IShape, { IShapeProps, IShapeConstructor } from "../Shape/IShape";

export interface IShapeFactory {
  makeShape(type: string, props: IShapeProps): IShape;
}

class ShapeFactory implements IShapeFactory {
  private shapes: { [index: string]: IShapeConstructor };

  constructor(mapOfAvailableShapes: { [index: string]: IShapeConstructor }) {
    this.shapes = mapOfAvailableShapes;
  }

  makeShape(type: string, props: IShapeProps) {
    return new this.shapes[type](props);
  }
}

export default ShapeFactory;
