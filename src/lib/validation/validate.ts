/**
 * Generic validation helper — throws a structured error on failure.
 */
import type { ZodSchema, ZodIssue } from "zod";

export class ValidationError extends Error {
  issues: ZodIssue[];
  constructor(message: string, issues: ZodIssue[]) {
    super(message);
    this.name = "ValidationError";
    this.issues = issues;
  }
}

export function validateOrThrow<T>(schema: ZodSchema<T>, input: unknown): T {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw new ValidationError(
      result.error.issues.map((i) => i.message).join("; "),
      result.error.issues,
    );
  }
  return result.data;
}
