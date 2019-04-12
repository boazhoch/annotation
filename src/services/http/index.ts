import { IHttp } from "./IHttp";

class Http implements IHttp {
  private endPoint: string;

  public constructor(endPoint: string) {
    this.endPoint = endPoint;
  }

  /**
   *
   *
   * @private
   * @param {string} path
   * @returns
   * @memberof Http
   */
  private extendEndPointWithPath(path: string) {
    return `${this.endPoint}${path}`;
  }

  /**
   *
   *
   * @param {string} path
   * @returns
   * @memberof Http
   */
  public get(path: string) {
    const fullPath = this.extendEndPointWithPath(path);
    return fetch(fullPath);
  }

  public post(path: string = "/shapes", data: any) {
    const fullPath = this.extendEndPointWithPath(path);
    return fetch(fullPath, {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }).then(res => {
      if (res.ok) {
        return res;
      } else {
        throw new Error("Error while sending data.");
      }
    });
  }
}

export default Http;
