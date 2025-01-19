import Trips from "../../domain/trips/trips.types";

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