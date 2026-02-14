import { NextResponse } from "next/server";
import { AppError } from "./AppError";

export function handleApiError(error: unknown) {
  console.error("❌ API Error:", error);

  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        code: error.code,
        message: error.message,
      },
      { status: error.statusCode }
    );
  }

  return NextResponse.json(
    {
      success: false,
      code: "INTERNAL_ERROR",
      message: "Une erreur interne est survenue",
    },
    { status: 500 }
  );
}
