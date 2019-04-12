import React from "react";
import { Transformer } from "react-konva";

interface IProps {
  selected: any;
}

class TransformerComponent extends React.PureComponent<IProps> {
  private transformer: any;

  componentDidMount() {
    this.checkNode();
  }

  componentDidUpdate() {
    this.checkNode();
  }

  checkNode() {
    const { selected } = this.props;

    if (selected) {
      this.transformer.attachTo(selected);
    } else {
      this.transformer.detach();
    }

    this.transformer.getLayer().batchDraw();
  }
  render() {
    return (
      <Transformer
        name="transformer"
        ref={node => {
          this.transformer = node;
        }}
        rotateEnabled={false}
      />
    );
  }
}

export default TransformerComponent;
