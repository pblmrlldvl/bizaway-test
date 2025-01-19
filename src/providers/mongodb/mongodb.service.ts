import { DbFunctions } from './mongodb'

import IDataSource from '../../domain/shared/data-source.interface'

export default class MongoDbService<ClassType, Class extends ClassType> implements IDataSource {
  private collectionName: string
  protected dbFunctions: DbFunctions
  constructor({
    collectionName,
    uri,
    dbName
  }: {
    collectionName: string
    uri?: string
    dbName?: string
  }) {
    this.collectionName = collectionName
    this.dbFunctions = new DbFunctions(uri, dbName)
  }

  async getById(id: string) {
    const result = await this.dbFunctions.findById(this.collectionName, id)
    return result || null
  }

  async getAll(query: any = {}) {
    const results = await this.dbFunctions.find(
      this.collectionName,
      query,
      {}
    )
    return results || []
  }

  async create(values: Partial<Omit<ClassType, 'id' | 'created' | 'updated'>>) {
    const result = await this.dbFunctions.insertOne(this.collectionName, values)

    return this.getById(result.insertedId.toString())
  }

  async deleteById(id: any) {
    const result = await this.dbFunctions.deleteOne(this.collectionName, { id })

    if (result.acknowledged && result.modifiedCount > 0) return true
    return false
  }
}
