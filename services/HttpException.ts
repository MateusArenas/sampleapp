export default class HttpException extends Error {
  message: string;
  status?: number;
  code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.message = message;
    this.code = code;
  }

  static isHttpException(error: any): error is HttpException {
    return error instanceof HttpException;
  }
}