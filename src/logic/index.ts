import fetchPrayerTimes, { Timings, AllTimings } from './fetchPrayers';
import {
  createMomentObject,
  createMomentTime,
  subtractAndFormat
} from './dateAndTime';
import createReminderRequest from './createReminderRequest';
import messages from './messages';

export const createPrayerArray = (prayers: Timings) =>
  Object.keys(prayers).map((prayer) => ({
    prayer,
    time: createMomentTime(prayers[prayer]),
    message: messages[prayer] as string
  }));

export const filterPrayers = (prayers: AllTimings): Timings => {
  const toRemove = ['Sunrise', 'Sunset', 'Imsak', 'Midnight'];
  toRemove.forEach((value) => delete prayers[value]);
  return prayers;
};

export const main = async () => {
  const apiTimes = await fetchPrayerTimes();
  if (!apiTimes) {
    return null;
  }

  const { Sunrise } = apiTimes;
  const filteredPrayers = filterPrayers(apiTimes);
  const prayerTimes = createPrayerArray(filteredPrayers);

  const twentyFiveMinuteReminder = (
    index: number,
    prayer: string,
    time: string
  ) => {
    prayerTimes.splice(index, 0, {
      prayer,
      time: subtractAndFormat(createMomentObject(time), 25),
      message: messages[prayer]
    });
  };

  twentyFiveMinuteReminder(1, 'PreSunrise', createMomentTime(Sunrise));
  twentyFiveMinuteReminder(3, 'PreAsr', prayerTimes[3].time);
  twentyFiveMinuteReminder(5, 'PreMaghrib', prayerTimes[5].time);
  twentyFiveMinuteReminder(7, 'PreIsha', prayerTimes[7].time);
  twentyFiveMinuteReminder(9, 'PreFajr', prayerTimes[0].time);

  return prayerTimes.map((prayerTime) =>
    createReminderRequest(prayerTime.time, prayerTime.message)
  );
};
