const fetchPrayers = require('../src/fetchPrayers');
const athanApi = require('../src/api');
const apiResponse = require('./sampleApiResponse.json');

describe('FetchPrayers', () => {
  it('returns prayer times array from api call', async () => {
    jest.spyOn(athanApi, 'get').mockReturnValueOnce(apiResponse);

    const expected = apiResponse.data.data.timings;
    const actual = await fetchPrayers();
    expect(actual).toEqual(expected);
  });

  it('error from api', async () => {
    jest
      .spyOn(athanApi, 'get')
      .mockReturnValueOnce({ status: 404, data: null });

    const actual = await fetchPrayers();
    expect(actual).toEqual(null);
  });
});
