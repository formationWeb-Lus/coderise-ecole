import { AppError } from "./AppError";

export class ValidationError extends AppError {
  constructor(message = "Données invalides") {
    super(message, 400, "VALIDATION_ERROR");
  }
}
