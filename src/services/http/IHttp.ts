export interface IHttp {
  get(path: string): Promise<Response>;
  post(post: string, data: any): Promise<Response>;
}

export interface IHttpConstructor {
  new (path: string): IHttp;
}
