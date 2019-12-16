import { Url } from '../const';

export const fetchSchedules = async (stop, apiKey) => {
  const requestUrl = new URL(`${Url.MBTA_API}/schedules`);
  if (apiKey) requestUrl.searchParams.set('api_key', apiKey);
  requestUrl.searchParams.set('filter[stop]', stop);
  requestUrl.searchParams.set('sort', 'arrival_time');
  const now = new Date();
  requestUrl.searchParams.set('filter[min_time]', `${now.getHours()}:${now.getMinutes()}`);
  requestUrl.searchParams.set('include', 'trip,prediction');

  const response = await fetch(requestUrl);
  if (!response.ok) throw Error(response.statusText || `Status ${response.status}`);
  const { data, included } = await response.json();
  const [trips, predictions] = included.reduce((acc, record) => {
    if (record.type === 'trip') {
      const { headsign, name } = record.attributes;
      const trip = { destination: headsign, train: name };
      acc[0].set(record.id, trip);
    } else if (record.type === 'prediction') {
      acc[1].set(record.relationships.trip.data.id, record.attributes.status);
    }

    return acc;
  }, [new Map(), new Map()]);

  return data.map(({ id, relationships, attributes }) => {
    const tripId = relationships.trip.data.id;
    const { destination, train } = trips.get(tripId);
    const status = predictions.get(tripId);

    return {
      id,
      arrival: new Date(attributes.arrival_time),
      destination,
      train,
      status,
    };
  });
}