import {
  AppException,
  AppExceptionDetail,
  AppValidationException,
} from './app.exception';

export class AppError extends Error {
  errors: any;
  constructor(
    error:
      | AppException
      | AppException[]
      | AppValidationException
      | AppValidationException[],
    message?: string,
  ) {
    if (error) {
      const getExceptionDetails = (err: any) =>
        Array.isArray(err)
          ? err.map(
              (value) =>
                AppExceptionDetail[value as keyof typeof AppExceptionDetail],
            )
          : [AppExceptionDetail[err as keyof typeof AppExceptionDetail]];

      super(Array.isArray(error) ? error[0] : error);
      this.errors = getExceptionDetails(error);
    } else if (message) {
      super(message);
      this.errors = AppExceptionDetail[AppException.UNKNOWN_ERROR];
    }
  }
}
