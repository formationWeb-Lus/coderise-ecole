import { Prisma } from "@prisma/client";
import { DatabaseError } from "./DatabaseError";

export function handlePrismaError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      throw new DatabaseError("Donnée déjà existante");
    }
  }

  throw new DatabaseError();
}
