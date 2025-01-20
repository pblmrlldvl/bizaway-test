import mongoDB, { Db, MongoClient } from 'mongodb'
import { ObjectId } from 'bson'

const clients: Record<string, MongoClient> = {}
const dbs: Record<string, mongoDB.Db> = {}

const toObjectId = (value: string) => ObjectId.isValid(value) ? new ObjectId(value) : undefined
const deleteClient = (uri: string) => () => delete clients[uri]
const handleClientError = (uri: string) => (error: any) => {
  console.error(`MongoDB client error: ${error.msg || error.message || 'Unknown error'}`)
  deleteClient(uri)
  throw error
}

/**
 * Retrieves a MongoDB client instance for the given URI. If a client does not already exist for the URI,
 * a new `MongoClient` is created, and event listeners for 'error' and 'close' events are attached.
 *
 * @param {string} [uri=process.env.DB_CONN_STRING || ''] - The connection string URI for the MongoDB client.
 * @returns {MongoClient} The MongoDB client instance associated with the given URI.
 */
export const getClient = (uri = process.env.DB_CONN_STRING || '') => {
  if (!clients[uri]) {
    clients[uri] = new MongoClient(uri)
    clients[uri].on('error', handleClientError(uri))
    clients[uri].on('close', deleteClient(uri))
  }
  return clients[uri]
}

/**
 * Connects a MongoDB client using the provided URI and database name.
 * If a client for thar URI and database name does not exists, creates a new one before connecting it.
 *
 * @param {string} [uri=process.env.DB_CONN_STRING || ''] - The connection string URI for the MongoDB client.
 * @param {string} [dbName=process.env.DB_NAME || ''] - The name of the database to connect to.
 * @returns {Promise<void>} A promise that resolves when the client is successfully connected.
 * @throws {Error} Throws an error if the connection fails.
 */
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

/**
 * Retrieves a MongoDB database instance. If the client for the given URI does not exist,
 * it creates a new MongoClient and stores it. If the database instance for the given URI
 * and database name does not exist, it creates a new database instance and stores it before returning it.
 *
 * @param {string} [uri=process.env.DB_CONN_STRING || ''] - The connection string URI for the MongoDB client.
 * @param {string} [dbName=process.env.DB_NAME || ''] - The name of the database to connect to.
 * @returns {Db} The MongoDB database instance.
 */
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
  
/**
 * Class containing useful database methods for MongoDB.
 */
export class DbFunctions {
  public db: Db

  /**
   * @param {string} [uri] - The URI of the MongoDB server.
   * @param {string} [dbName] - The name of the database.
   */
  constructor(uri?: string, dbName?: string) {
    this.db = getDb(uri, dbName)
  }
  
  /**
   * Inserts a document into a collection.
   * @param {string} collection - The name of the collection.
   * @param {object} query - The document to insert.
   * @returns {Promise<InsertOneWriteOpResult<any>>} The result of the insert operation.
   */
  async insertOne(collection: string, query: object) {
    return await this.db
    .collection(collection)
    .insertOne({ ...query, createdAt: new Date(), updatedAt: new Date() })
  }

  /**
   * Finds a document from a collection.
   * @param {string} collection - The name of the collection.
   * @param {object} query - The query to filter the document.
   * @param {object} [options] - Optional settings for the find operation.
   * @returns {Promise<any>} The found document.
   */
  async findOne(collection: string, query: object, options?: object) {
    return await this.db
    .collection(collection)
    .findOne(omitDeletedQuery(query), options)
  }
  
  /**
   * Finds documents from a collection.
   * @param {string} collection - The name of the collection.
   * @param {object} query - The query to filter documents.
   * @param {object} project - The projection to specify or restrict fields to return.
   * @returns {Promise<any[]>} The found documents.
   */
  async find(collection: string, query: object, project: object) {
    return await this.db
    .collection(collection)
    .find(omitDeletedQuery(query))
    .project(project)
    .toArray()
  }
  
  /**
   * Update documents in a collection.
   * @param {string} collection - The name of the collection.
   * @param {object} query - The query to filter the documents to update.
   * @param {object} update - The object with the properties to update aqnd its values.
   * @returns {Promise<UpdateWriteOpResult>} The result of the update operation.
   */
  async updateMany(collection: string, query: object, update: object) {
    return await this.db.collection(collection).updateMany(omitDeletedQuery(query), update)
  }
}
  
function omitDeletedQuery(query: object) {
  return { deleted: { $ne: true }, ...query }
}
  