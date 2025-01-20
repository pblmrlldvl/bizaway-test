import Trips from "./trips.types";

export default class Trip implements Trips.Trip {
    origin!: string
    destination!: string
    cost!: number
    duration!: number
    type!: string
    id!: string
    displayName?: string

    constructor(values: Trips.Trip) {
        Object.assign(this, values)
    }

    equals(obj: Trip) {
        return this.origin === obj.origin &&
            this.destination === obj.destination &&
            this.cost === obj.cost &&
            this.duration === obj.duration &&
            this.type === obj.type &&
            this.id === obj.id &&
            this.displayName ? this.displayName === obj.displayName : true
    }
}