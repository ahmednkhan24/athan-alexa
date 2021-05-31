const athanApi = require('./api');

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

  return timings;
};

module.exports = fetchPrayers;
