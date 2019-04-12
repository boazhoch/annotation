import IShape, { IShapeProps } from "../Shape/IShape";
import { IShapeFactory } from "../ShapeFactory";

interface IShapeMap {
  setShapeInMap(shape: IShape): IShape;
  deleteShape(id: string): IShape | undefined;
  count(): number;
  getShapesIdAndValue(): IterableIterator<[string, IShape]>;
  getShapeById(id: string): IShape | undefined;
  getShapes(): IterableIterator<IShape>;
}

class ShapeMap implements IShapeMap {
  private shapesMap: Map<string, IShape> = new Map();

  setShapeInMap(shape: IShape) {
    this.shapesMap.set(shape.props.id, shape);
    return shape;
  }

  deleteShape(id: string) {
    const shape = this.shapesMap.get(id);
    this.shapesMap.delete(id);
    return shape;
  }

  count() {
    return this.shapesMap.size;
  }

  getShapesIdAndValue() {
    return this.shapesMap.entries();
  }

  getShapeById(id: string) {
    return this.shapesMap.get(id);
  }

  getShapes() {
    return this.shapesMap.values();
  }
}

export interface ISurface extends IShapeMap {
  make(type: string, props: IShapeProps): IShape;
  updateShape(id: string, props: IShapeProps): IShape | null;
}

export interface ISurfaceConstructor {
  new (): ISurface;
}

class Surface extends ShapeMap implements ISurface {
  private shapeFactory: IShapeFactory;

  constructor(shapeFactory: IShapeFactory) {
    super();
    this.shapeFactory = shapeFactory;
  }

  make(type: string, props: IShapeProps) {
    const shape = this.shapeFactory.makeShape(type, props);
    this.setShapeInMap(shape);
    return shape;
  }

  updateShape(id: string, props: IShapeProps) {
    const shape = this.getShapeById(id);
    if (shape) {
      shape.update(props);
      return shape;
    }
    return null;
  }
}

export default Surface;
