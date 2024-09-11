import { ImageSource, ImageSourceOptions } from "excalibur";

export class APIImageSource extends ImageSource {
  /**
   * image source will have the root API url prepended
   */
  constructor(imageSource: string, options?: ImageSourceOptions) {
    super((process.env.REACT_APP_API_ROOT || '') + imageSource, options);
  }
}