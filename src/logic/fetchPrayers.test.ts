import fetchPrayers from './fetchPrayers';
import athanApi from './api';
import apiResponse from './sampleApiResponse.json';

describe('FetchPrayers', () => {
  it('returns prayer times array from api call', async () => {
    jest.spyOn(athanApi, 'get').mockReturnValueOnce(apiResponse as any);

    const expected = apiResponse.data.data.timings;
    const actual = await fetchPrayers();
    expect(actual).toEqual(expected);
  });

  it('error from api', async () => {
    (jest.spyOn(athanApi, 'get') as any).mockReturnValueOnce({
      status: 404,
      data: null
    });

    const actual = await fetchPrayers();
    expect(actual).toEqual(null);
  });
});
