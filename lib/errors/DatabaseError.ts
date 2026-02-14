import { AppError } from "./AppError";

export class DatabaseError extends AppError {
  constructor(message = "Erreur base de données") {
    super(message, 500, "DATABASE_ERROR");
  }
}
