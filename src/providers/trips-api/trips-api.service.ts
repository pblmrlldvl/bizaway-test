import axios from 'axios'

import Trips from '../../domain/trips/trips.types'
import { toDomain } from './trips-api.service.adapters';

export class TripsApiService implements Trips.TripsApiInterface {
    async getTrips(origin: string, destination: string) {
        try {
            const response = await axios.get(process.env.TRIPS_API_BASE_URL!, {
                params: {
                    origin,
                    destination
                },
                headers: {
                    'x-api-key': process.env.TRIPS_API_KEY
                },
                timeout: process.env.TRIPS_API_TIMEOUT ? Number(process.env.TRIPS_API_TIMEOUT) : 5000
            });

            return response.data?.map(toDomain) || [];
        } catch (error) {
            console.error('Providers trips service ' + error)
            throw error
        }
    }

}

export default TripsApiService