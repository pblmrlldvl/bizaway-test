import { identity, pipe } from "lodash/fp"

import { IDataSource, IBaseRepository } from "./types"

export default class BaseRepository<ClassType, Class extends ClassType> implements IBaseRepository<Class> {
    public fromDataBase: (arg: Record<any, any>) => Class
    public toDataBase: (arg: any) => Record<any, any>
    constructor(
        private source: IDataSource,
        classConstructor: (arg: any) => Class,
        fromDataBaseAdapter?: (arg: Record<any, any>) => ClassType,
        toDataBaseAdapter?: (arg: Partial<ClassType>) => Record<any, any>
    ) {
        this.fromDataBase = fromDataBaseAdapter
            ? pipe(fromDataBaseAdapter, classConstructor)
            : identity
        this.toDataBase = toDataBaseAdapter
            ? pipe(classConstructor, toDataBaseAdapter)
            : identity
    }

    async getById(id: string): Promise<Class | null> {
        const result = await this.source.getById(id)

        if (result) {
            return this.fromDataBase(result)
        }
        return null
    }

    async getAll(query: any): Promise<Class[]> {
        const results = await this.source.getAll(query)

        return results.map(this.fromDataBase)
    }

    async create(values: Class): Promise<Class | null> {
        const dbValues = this.toDataBase(values)

        const result = await this.source.create(dbValues)

        return this.fromDataBase(result)
    }

    deleteById(id: string): Promise<boolean> {
        return this.source.deleteById(id)
    }
}