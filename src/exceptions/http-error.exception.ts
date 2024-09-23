export class HttpErrorException extends Error {
  public statusCode: number;
  public message: string;
  constructor(message, statusCode) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
  }

  static BadRequest(message = "Bad request", statusCode = 400) {
    return new HttpErrorException(message, statusCode);
  }

  static InternalError(message = "Server error", statusCode = 500) {
    return new HttpErrorException(message, statusCode);
  }

  static NotFound(message = "Not found", statusCode = 404) {
    return new HttpErrorException(message, statusCode);
  }
}
