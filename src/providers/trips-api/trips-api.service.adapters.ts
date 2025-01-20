import Trips from "../../domain/trips/trips.types";

/**
 * Converts data received from the external API to a domain-specific `Trips.Trip` object.
 *
 * @param data - The data received from the external API.
 * @returns A `Trips.Trip` domain object containing the trip details.
 */
export function toDomain(data: any): Trips.Trip {
  return {
    origin: data.origin,
    destination: data.destination,
    cost: data.cost,
    duration: data.duration,
    type: data.type,
    id: data.id,
    displayName: data.display_name,
  };
}