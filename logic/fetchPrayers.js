const athan = require('../api/athan');

const fetchPrayers = async () => {
  const params = {
    latitude: '42.01799659277165',
    longitude: '-88.20016064860027',
    method: 2, // ISNA
    school: 1 // Hanafi
  };

  const athanResponse = await athan.get('/timings', { params });

  if (athanResponse.status !== 200) {
    return null;
  }
  const { timings } = athanResponse.data.data;

  return timings;
};

module.exports = fetchPrayers;
