import { Url } from '../const';

const trips = new Map();

export const fetchSchedules = async (stop, apiKey) => {
  const requestUrl = new URL(`${Url.MBTA_API}/schedules`);
  if (apiKey) requestUrl.searchParams.set('api_key', apiKey);
  else requestUrl.searchParams.set('page[limit]', 10);
  requestUrl.searchParams.set('filter[stop]', stop);
  requestUrl.searchParams.set('sort', 'arrival_time');
  const now = new Date();
  requestUrl.searchParams.set('filter[min_time]', `${now.getHours()}:${now.getMinutes()}`);

  const response = await fetch(requestUrl);
  if (!response.ok) throw Error(response.statusText || `Status ${response.status}`);
  const { data } = await response.json();

  return await data.reduce((p, value) => p.then(async (processed) => {
    const { trip } = value.relationships;
    const { arrival_time } = value.attributes;
    const { destination, train } = await getTrip(trip.data.id);

    processed.push({
      id: value.id,
      arrival: new Date(arrival_time),
      destination,
      train,
    });

    return processed;
  }), Promise.resolve([]));
}

const getTrip = async (tripId) => {
  let trip = trips.get(tripId);
  if (!trip) {
    const response = await fetch(`${Url.MBTA_API}/trips/${tripId}`);
    if (!response.ok) throw Error(response.statusText || `Status ${response.status}`);
    const { data } = await response.json();
    const { headsign, name } = data.attributes;
    trip = { destination: headsign, train: name };
    trips.set(tripId, trip);
  }

  return trip;
}