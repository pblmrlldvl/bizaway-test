export interface IDataSource {
    getById(id: string): Promise<any | null>
    getAll(query: any): Promise<any[]>
    create(values: any): Promise<any | null>
    deleteById(id: string): Promise<boolean>
}

export interface IBaseRepository<T> {
    getById(id: string): Promise<T | null>
    getAll(query: any): Promise<T[]>
    create(values: any): Promise<T | null>
    deleteById(id: string): Promise<boolean>
}