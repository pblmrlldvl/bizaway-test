import { TripsService } from './trips.service'
import Trips from './trips.types'
import ExternalServiceError from '../shared/domain-errors/external-service-error'

describe('TripsService', () => {
    let tripsService: TripsService
    let tripsApiMock: jest.Mocked<Trips.TripsApiInterface>

    beforeEach(() => {
        tripsApiMock = {
            getTrips: jest.fn(),
        }
        tripsService = new TripsService(tripsApiMock)
    })

    it('should call tripsApi.getTrips with correct parameters', async () => {
        const params: Trips.GetTripsParams = {
            origin: 'ATL',
            destination: 'LAX',
            sortBy: 'fastest',
        }

        tripsApiMock.getTrips.mockResolvedValueOnce([])

        await tripsService.getTrips(params)

        expect(tripsApiMock.getTrips).toHaveBeenCalledWith('ATL', 'LAX')
    })

    it('should use default sortBy if not provided', async () => {
        const params: Trips.GetTripsParams = {
            origin: 'ATL',
            destination: 'LAX',
            sortBy: undefined,
        }

        process.env.GET_TRIPS_DEFAULT_SORT_BY = 'duration'
        tripsApiMock.getTrips.mockResolvedValueOnce([])

        await tripsService.getTrips(params)

        expect(tripsApiMock.getTrips).toHaveBeenCalledWith('ATL', 'LAX')
    })

    it('should throw ExternalServiceError domain error if tripsApi fails', async () => {
        const params: Trips.GetTripsParams = {
            origin: 'ATL',
            destination: 'LAX',
            sortBy: 'cheapest',
        }

        const error = new Error('API Error')
        tripsApiMock.getTrips.mockRejectedValueOnce(error)

        try {
            await tripsService.getTrips(params)
        } catch (e: any) {
            expect(e).toBeInstanceOf(ExternalServiceError)
            expect(e.message).toBe('API Error')
            expect(e.service).toBe('TripsApi')
            return
        }
        expect(true).toBe(false)
    })

    it('should throw ExternalServiceError with default message if origin error has no message', async () => {
        const params: Trips.GetTripsParams = {
            origin: 'ATL',
            destination: 'LAX',
            sortBy: 'cheapest',
        }

        const error = {}
        tripsApiMock.getTrips.mockRejectedValueOnce(error)

        try {
            await tripsService.getTrips(params)
        } catch (e: any) {
            expect(e).toBeInstanceOf(ExternalServiceError)
            expect(e.message).toBe('External service error')
            expect(e.service).toBe('TripsApi')
            return
        }
        expect(true).toBe(false)
    })

    it('should sort trips by cost when sortBy is cheapest', async () => {
        const params: Trips.GetTripsParams = {
            origin: 'ATL',
            destination: 'LAX',
            sortBy: 'cheapest',
        }

        const trips = [
            { cost: 200, duration: 5 },
            { cost: 100, duration: 6 },
            { cost: 150, duration: 4 },
        ] as Array<Trips.Trip>

        tripsApiMock.getTrips.mockResolvedValueOnce(trips)

        const result = await tripsService.getTrips(params)

        expect(result).toEqual([
            { cost: 100, duration: 6 },
            { cost: 150, duration: 4 },
            { cost: 200, duration: 5 },
        ])
    })

    it('should sort trips by duration when sortBy is fastest', async () => {
        const params: Trips.GetTripsParams = {
            origin: 'ATL',
            destination: 'LAX',
            sortBy: 'fastest',
        }

        const trips = [
            { cost: 200, duration: 5 },
            { cost: 100, duration: 6 },
            { cost: 150, duration: 4 },
        ] as Array<Trips.Trip>

        tripsApiMock.getTrips.mockResolvedValueOnce(trips)

        const result = await tripsService.getTrips(params)

        expect(result).toEqual([
            { cost: 150, duration: 4 },
            { cost: 200, duration: 5 },
            { cost: 100, duration: 6 },
        ])
    })
})