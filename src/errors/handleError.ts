import { AppError } from "./appErrors";

export const EXIT_APP_ERROR = 1;
export const EXIT_UNEXPECTED_ERROR = 2;

/** Reports any error to stderr in one consistent format and returns the process exit code. */
export const handleError = (err: unknown): number => {
  if (err instanceof AppError) {
    console.error(`Error: ${err.message}`);
    return EXIT_APP_ERROR;
  }
  console.error("Unexpected error:", err); // keep the stack for debugging
  return EXIT_UNEXPECTED_ERROR;
};
