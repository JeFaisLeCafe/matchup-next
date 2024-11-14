import { NextResponse } from "next/server";

export function handleApiError(error: unknown): NextResponse {
  console.error("API Error:", error);

  if (error instanceof Error) {
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { error: "Internal Server Error", details: "An unknown error occurred" },
    { status: 500 }
  );
}
