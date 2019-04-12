import React from "react";
import IShape from "../../services/Shape/IShape";
import Panel from "../Panel/Panel";

interface IPanelContainerProps {
  selectedShape: IShape | null;
  onTitleChange: (id: string, arg: string) => void;
  onDelete(selected: IShape): void;
  options: string[];
  renderProps: () => JSX.Element;
}

class PanelContainer extends React.Component<IPanelContainerProps> {
  onTitleChange = (id: string, arg: string) => {
    this.props.onTitleChange(id, arg);
  };

  render() {
    return (
      <>
        {this.props.renderProps()}
        {this.props.selectedShape && (
          <Panel
            handleDelete={this.props.onDelete}
            options={this.props.options}
            onTitleChange={this.onTitleChange}
            selectedShape={this.props.selectedShape}
          />
        )}
      </>
    );
  }
}

export default PanelContainer;
