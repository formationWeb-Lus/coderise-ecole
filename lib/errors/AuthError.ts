import { AppError } from "./AppError";

export class AuthError extends AppError {
  constructor(message = "Non autorisé") {
    super(message, 401, "AUTH_ERROR");
  }
}
