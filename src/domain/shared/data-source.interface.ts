export default interface IDataSource {
    getById(id: string): Promise<any | null>
    getAll(query: any): Promise<any[]>
    create(values: any): Promise<any | null>
    deleteById(id: string): Promise<boolean>
}