export function assertNoError(error: unknown) {
  if (error) {
    throw error
  }
}
