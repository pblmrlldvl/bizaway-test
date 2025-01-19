import { TripsService } from './trips.service'
import Trips from './trips.types'
import ExternalServiceError from '../shared/domain-errors/external-service-error'
import PersistenceError from '../shared/domain-errors/persistence-error'
import TripsRepository from './trips.repository'

describe('TripsService', () => {
    let tripsService: TripsService;
    let tripsApiMock: jest.Mocked<Trips.TripsApiInterface>;
    let tripsRepositoryMock: jest.Mocked<TripsRepository>;

    beforeEach(() => {
        tripsApiMock = {
            getTrips: jest.fn(),
        };
        tripsRepositoryMock = {
            create: jest.fn(),
            getAll: jest.fn(),
            deleteById: jest.fn(),
        } as unknown as jest.Mocked<TripsRepository>;

        tripsService = new TripsService(tripsApiMock, tripsRepositoryMock);
    });

    describe('getTrips', () => {
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

    describe('saveTrip', () => {
        it('should return the result of saving a trip using the trips repository', async () => {
            const trip = { id: '1' } as Trips.Trip
            tripsRepositoryMock.create.mockResolvedValue(trip)

            const result = await tripsService.saveTrip(trip)

            expect(result).toEqual(trip)
        })

        it('should throw PersistenceError when the call to trips repository rejects', async () => {
            tripsRepositoryMock.create.mockRejectedValueOnce(new Error())

            try {
                await tripsService.saveTrip({ id: '1' } as Trips.Trip)
            } catch (e: any) {
                expect(e).toBeInstanceOf(PersistenceError)
                return
            }
            expect(true).toBe(false)
        })
        it('should throw PersistenceError when the call to trips repository returns null', async () => {
            tripsRepositoryMock.create.mockResolvedValue(null)

            try {
                await tripsService.saveTrip({ id: '1' } as Trips.Trip)
            } catch (e: any) {
                expect(e).toBeInstanceOf(PersistenceError)
                return
            }
            expect(true).toBe(false)
        })
    })

    describe('listAllSavedTrips', () => {
        it('should return all saved trips returned by the trips repository', async () => {
            const trips = [{ id: '1' }] as Array<Trips.Trip>
            tripsRepositoryMock.getAll.mockResolvedValue(trips)

            const result = await tripsService.listAllSavedTrips()

            expect(result).toEqual(trips)
        })

        it('should throw PersistenceError when the call to trips repository rejects', async () => {
            tripsRepositoryMock.getAll.mockRejectedValue(new Error())

            try {
                await tripsService.listAllSavedTrips()
            } catch (e: any) {
                expect(e).toBeInstanceOf(PersistenceError)
                return
            }
            expect(true).toBe(false)
        })
    })

    describe('deleteSavedTrip', () => {
        it('should return the result of deleting a saved trip using the trips repository', async () => {
            tripsRepositoryMock.deleteById.mockResolvedValue(true)

            const result = await tripsService.deleteSavedTrip('1')

            expect(result).toBe(true)
        })

        it('should throw PersistenceError when the call to trips repository rejects', async () => {
            tripsRepositoryMock.deleteById.mockRejectedValue(new Error())

            await expect(tripsService.deleteSavedTrip('1'))
                .rejects
                .toThrow(PersistenceError)
        })
    })
})