namespace Trips {
    /**
     * The array is defined as a constant assertion in order to be able to later use it
     * or any subset of it as a string union-type
     */
    export const countryCodesAssertion = [
        "ATL", "PEK", "LAX", "DXB", "HND", "ORD", "LHR", "PVG", "CDG", "DFW",
        "AMS", "FRA", "IST", "CAN", "JFK", "SIN", "DEN", "ICN", "BKK", "SFO",
        "LAS", "CLT", "MIA", "KUL", "SEA", "MUC", "EWR", "MAD", "HKG", "MCO",
        "PHX", "IAH", "SYD", "MEL", "GRU", "YYZ", "LGW", "BCN", "MAN", "BOM",
        "DEL", "ZRH", "SVO", "DME", "JNB", "ARN", "OSL", "CPH", "HEL", "VIE"
    ] as const

    export const originCountryCodesAssertion = countryCodesAssertion
    export type OriginCountryCode = typeof originCountryCodesAssertion[number]

    export const destinationCountryCodesAssertion = countryCodesAssertion
    export type DestinationCountryCode = typeof destinationCountryCodesAssertion[number]

    export const getTripsSortByCriteriaAssertion = ['fastest', 'cheapest'] as const
    export type GetTripsSortByCriteria = typeof getTripsSortByCriteriaAssertion[number]

    export type GetTripsParams = {
        origin: OriginCountryCode
        destination: DestinationCountryCode
        sortBy?: GetTripsSortByCriteria
    }

    export interface TripsServiceInterface {
        getTrips({ origin, destination, sortBy }: GetTripsParams): Promise<Trip[]>
    }

    export interface TripsApiInterface {
        getTrips(origin: string, destination: string): Promise<Trip[]>
    }

    export type Trip = {
        origin: string,
        destination: string,
        cost: number,
        duration: number,
        type: string,
        id: string,
        displayName?: string
    }
}

export default Trips