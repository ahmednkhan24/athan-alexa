import { main, filterPrayers } from '.';
import fetchPrayers from './fetchPrayers';
import messages from './messages';
import apiResponse from './sampleApiResponse.json';

jest.mock('./fetchPrayers', () => jest.fn());

describe('Index', () => {
  // setups because we are mutating the original array using `delete`
  let originalTimings;

  beforeAll(() => {
    originalTimings = { ...apiResponse.data.data.timings };
  });

  beforeEach(() => {
    (fetchPrayers as any).mockImplementation(
      () => apiResponse.data.data.timings
    );
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

      // const alexaTime = prayerReminders[index].trigger.scheduledTime;
      // console.log(`alexa message: ${alexaMessage}, alexa time: ${alexaTime}\n`);

      expect(message).toEqual(alexaMessage);
    });
  });
});
