import { DbFunctions } from './mongodb'
import { IDataSource } from '../../domain/shared/types'

/**
 * MongoDbService is a generic service class for interacting with a MongoDB collection.
 * It currently provides methods to perform CRUD operations on the specified collection.
 *
 * @implements IDataSource as it is intended to act as data source for domain entities
 */
export default class MongoDbService implements IDataSource {
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
    const result = await this.dbFunctions.findOne(this.collectionName, { id })
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

  async create(values: any) {
    const result = await this.dbFunctions.insertOne(this.collectionName, values)

    return this.getById(result.insertedId.toString())
  }

  async deleteById(id: string) {
    const result = await this.dbFunctions.updateMany(this.collectionName, { id }, {
      $set: { deleted: true, updatedAt: new Date() }
    })

    if (result.acknowledged && result.modifiedCount > 0) return true
    return false
  }
}
