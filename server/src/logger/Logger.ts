export class Logger {
  static info(msg: string, ...obj: any[]) {
    console.info(msg, ...obj);
  }

  static error(msg: string, ...err: any[]) {
    console.error(msg, ...err);
  }
}

export const logErrorCallback = (msg: string) => (ex: any) => {
  Logger.error(msg, ex)
}