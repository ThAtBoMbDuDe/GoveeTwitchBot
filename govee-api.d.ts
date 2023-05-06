declare module 'govee-api' {
  export default class Govee {
    constructor(apiKey: string);
    public getDevices(): Promise<any>;
    public setDeviceState(device: string, model: string, state: any): Promise<any>;
  }
}