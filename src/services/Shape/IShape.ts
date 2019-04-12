interface IShape {
  getCoords(): coords;
  update(props: IShapeProps): void;
  props: IShapeProps;
}

export interface IShapeConstructor {
  new (props: IShapeProps): IShape;
}

export interface IShapeProps {
  coords: coords;
  size: size;
  id: string;
  stroke: string;
  name: string;
  text?: string;
}

type size = {
  width: number;
  height: number;
};

type coords = {
  x: number;
  y: number;
};

export default IShape;
