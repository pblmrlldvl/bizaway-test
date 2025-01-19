import DomainError from "../domain-error"
import DomainErrors from "../domain-errors.enum"

export default class PersistenceError extends DomainError {
    constructor(message: string) {
        super(message, DomainErrors.PERSISTENCE_ERROR)
    }
}