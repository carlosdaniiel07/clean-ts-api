import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as unknown as MongoClient,

  async connect (uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri)
  },

  async disconnect (): Promise<void> {
    await (this.client as MongoClient).close()
  },

  getCollection (name: string): Collection {
    return (this.client as MongoClient).db().collection(name)
  },

  mapToModel<T>(model: any): T {
    const { _id, ...data } = model
    return Object.assign({}, data, { id: _id })
  },

  mapToModels<T>(models: any[]): T[] {
    return models.map(model => this.mapToModel(model))
  }
}
