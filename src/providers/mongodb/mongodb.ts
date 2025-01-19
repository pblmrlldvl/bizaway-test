import mongoDB, { Db, MongoClient } from 'mongodb'
import { ObjectId } from 'bson'

const clients: Record<string, MongoClient> = {}

const dbs: Record<string, mongoDB.Db> = {}

export const toObjectId = (value: string) => {
    return ObjectId.isValid(value) ? new ObjectId(value) : undefined
}

const deleteClient = (uri: string) => () => delete clients[uri]
const handleClientError = (uri: string) => (error: any) => {
  console.error(`MongoDB client error: ${error.msg || error.message || 'Unknown error'}`)
  deleteClient(uri)
  throw error
}

export const getClient = (uri = process.env.DB_CONN_STRING || '') => {
  if (!clients[uri]) {
    clients[uri] = new MongoClient(uri)
    clients[uri].on('error', handleClientError(uri))
    clients[uri].on('close', deleteClient(uri))
  }
  return clients[uri]
}

export const connectClient = async (
  uri = process.env.DB_CONN_STRING || '',
  dbName = process.env.DB_NAME || ''
) => {
  try {
    const client = getClient(uri)
    await client.connect()
    console.log(`Connected to ${dbName} database\n`)
  } catch (e: any) {
    throw new Error(e.message)
  }
}

export const getDb = (
    uri = process.env.DB_CONN_STRING || '',
    dbName = process.env.DB_NAME || ''
  ) => {
    if (!clients[uri]) {
      clients[uri] = new MongoClient(uri)
      delete dbs[uri + dbName]
    }
    if (!dbs[uri + dbName]) {
      dbs[uri + dbName] = clients[uri].db(dbName)
    }
    return dbs[uri + dbName]
}
  
export class DbFunctions {
    public db: Db
    constructor(uri?: string, dbName?: string) {
      this.db = getDb(uri, dbName)
    }
  
    async insertOne(collection: string, query: object) {
      return await this.db
        .collection(collection)
        .insertOne({ ...query, createdAt: new Date(), updatedAt: new Date() })
    }

    async findById(collection: string, id: string, options?: object) {
        return await this.db
        .collection(collection)
        .findOne({ _id: toObjectId(id) }, options)
      }
  
    async find(collection: string, query: object, project: object) {
      return await this.db
        .collection(collection)
        .find(omitDeletedQuery(query))
        .project(project)
        .toArray()
    }
  
    async deleteOne(collection: string, query: object) {
      return await this.db.collection(collection).updateOne(omitDeletedQuery(query), {
        $set: { deleted: true, updatedAt: new Date() }
      })
    }
}
  
function omitDeletedQuery(query: object) {
  return { deleted: { $ne: true }, ...query }
}
  