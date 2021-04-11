/* eslint-disable no-unused-vars */
const { main, filterPrayers } = require('../src');
const fetchPrayers = require('../src/fetchPrayers');
const messages = require('../src/messages');
const apiResponse = require('./sampleApiResponse.json');

jest.mock('../src/fetchPrayers', () => jest.fn());

describe('Index', () => {
  // setups because we are mutating the original array using `delete`
  let originalTimings;

  beforeAll(() => {
    originalTimings = { ...apiResponse.data.data.timings };
  });

  beforeEach(() => {
    fetchPrayers.mockImplementation(() => apiResponse.data.data.timings);
  });

  afterEach(() => {
    apiResponse.data.data.timings = { ...originalTimings };
  });

  it('filterPrayers', () => {
    const expected = {
      Fajr: '04:57',
      Dhuhr: '12:54',
      Asr: '17:33',
      Maghrib: '19:30',
      Isha: '20:58'
    };

    const actual = filterPrayers(apiResponse.data.data.timings);
    expect(actual).toEqual(expected);
  });

  it('main', async () => {
    const prayerReminders = await main();

    Object.values(messages).forEach((message, index) => {
      const alexaMessage =
        prayerReminders[index].alertInfo.spokenInfo.content[0].text;
      expect(message).toEqual(alexaMessage);
    });
  });
});
