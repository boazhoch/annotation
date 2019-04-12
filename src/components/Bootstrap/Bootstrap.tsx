import React, { Component } from "react";
import CONFIG from "../../config";
import Http from "../../services/http";
import RequesterFactory from "../../services/RequesterFactory";
import App from "../App/App";

import { IHttp } from "../../services/http/IHttp";
import Surface, { ISurface } from "../../services/Surafce";
import ShapeFactory from "../../services/ShapeFactory";
import Shape from "../../services/Shape";
import Notifier from "../../services/notification";
import { INotifier } from "../../services/notification/INotifier";

const requesterFactory = new RequesterFactory({ http: Http });

interface IProps {}

class Bootstrap extends Component<IProps> {
  private appProps: {
    httpRequester: IHttp;
    surface: ISurface;
    notifier: INotifier;
  };

  constructor(props: IProps) {
    super(props);

    const httpRequester = requesterFactory.getService("http", CONFIG.END_POINT);

    this.appProps = {
      httpRequester,
      surface: new Surface(new ShapeFactory({ rect: Shape })),
      notifier: new Notifier()
    };
  }

  render() {
    return <App {...this.appProps} />;
  }
}

export default Bootstrap;
