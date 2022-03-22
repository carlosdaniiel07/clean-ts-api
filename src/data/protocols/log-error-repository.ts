export interface LogErrorRepository {
  logError: (stackTrace: string) => Promise<void>
}
