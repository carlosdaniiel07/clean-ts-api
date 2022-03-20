export interface LogErrorRepository {
  log: (stackTrace: string) => Promise<void>
}
