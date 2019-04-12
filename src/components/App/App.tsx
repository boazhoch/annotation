import React, { PureComponent } from "react";
import "./App.css";
import { IHttp } from "../../services/http/IHttp";
import { ISurface } from "../../services/Surafce";
import PanelContainer from "../PanelContainer/PanelContainer";
import SurfaceContainer from "../SurfaceContainer/SurfaceContainer";
import Notification from "../Notification/Notification";
import { INotifier } from "../../services/notification/INotifier";

interface IProps {
  httpRequester: IHttp;
  surface: ISurface;
  notifier: INotifier;
}

class App extends PureComponent<IProps> {
  private automobileTypes = [
    "Car",
    "Bus",
    "Truck",
    "Pedestrian",
    "School bus",
    "Garbage Truck"
  ];

  render() {
    return (
      <div className="App">
        <Notification />
        <div className="Surface" id="app">
          <SurfaceContainer
            notifier={this.props.notifier}
            requester={this.props.httpRequester}
            surface={this.props.surface}
            renderProp={(
              selected,
              onTitleChange,
              onDelete,
              onExport,
              buttonClassName
            ) => {
              return (
                <>
                  <PanelContainer
                    options={this.automobileTypes}
                    onDelete={onDelete}
                    onTitleChange={onTitleChange}
                    selectedShape={selected}
                    renderProps={() => (
                      <button
                        className={buttonClassName}
                        onClick={e => {
                          onExport();
                        }}
                      >
                        Export
                      </button>
                    )}
                  />
                </>
              );
            }}
          />
        </div>
      </div>
    );
  }
}

export default App;
