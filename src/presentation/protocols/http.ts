export type HttpRequest = {
  headers?: any
  params?: {
    [key: string]: string
  }
  body?: any
  accountId?: string
}

export type HttpResponse = {
  statusCode: number
  body: any
}
