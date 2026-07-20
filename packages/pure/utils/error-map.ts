import { AstroError } from 'astro/errors'
import type { z } from 'astro/zod'

type ParseResult<T> =
  | { success: true; data: T }
  | { success: false; error: { issues: Array<{ message: string }> } }

/** Parse input with a Zod schema and surface validation failures as Astro errors. */
export function parseWithFriendlyErrors<T extends z.ZodType>(
  schema: T,
  input: z.input<T>,
  message: string
): z.output<T> {
  return processParsedData(schema.safeParse(input), message)
}

/** Async variant of parseWithFriendlyErrors for schemas with async refinements. */
export async function parseAsyncWithFriendlyErrors<T extends z.ZodType>(
  schema: T,
  input: z.input<T>,
  message: string
): Promise<z.output<T>> {
  return processParsedData(await schema.safeParseAsync(input), message)
}

function processParsedData<T>(parsedData: ParseResult<T>, message: string): T {
  if (!parsedData.success) {
    throw new AstroError(message, parsedData.error.issues.map((issue) => issue.message).join('\n'))
  }
  return parsedData.data
}
