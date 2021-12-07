import athanApi from './api';

export type Timings = {
  Sunrise: string;
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
};

export type AllTimings = Timings & {
  Sunset: string;
  Imsak: string;
  Midnight: string;
};

const fetchPrayers = async () => {
  const params = {
    city: 'Streamwood',
    state: 'Illinois',
    country: 'US',
    method: 2, // ISNA
    school: 1, // Hanafi
    tune: '0,0,0,0,0,0,0,0,0'
  };

  const athanResponse = await athanApi.get('/timingsByCity', { params });

  if (athanResponse.status !== 200) {
    return null;
  }
  const { timings } = athanResponse.data.data;

  return timings as AllTimings;
};

export default fetchPrayers;
