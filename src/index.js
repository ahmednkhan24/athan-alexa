const fetchPrayerTimes = require('./fetchPrayers');
const {
  createMomentObject,
  createMomentTime,
  subtractAndFormat
} = require('./dateAndTime');
const createReminderRequest = require('./createReminderRequest');
const messages = require('./messages');

const createPrayerArray = (prayers) =>
  Object.keys(prayers).map((prayer) => ({
    prayer,
    time: createMomentTime(prayers[prayer]),
    message: messages[prayer]
  }));

const filterPrayers = (prayers) => {
  const toRemove = ['Sunrise', 'Sunset', 'Imsak', 'Midnight'];
  toRemove.forEach((value) => delete prayers[value]);
  return prayers;
};

const main = async () => {
  const apiTimes = await fetchPrayerTimes();
  if (!apiTimes) {
    return null;
  }

  const { Sunrise } = apiTimes;
  const filteredPrayers = filterPrayers(apiTimes);
  const prayerTimes = createPrayerArray(filteredPrayers);

  const twentyFiveMinuteReminder = (index, prayer, time) => {
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

module.exports = {
  main,
  createPrayerArray,
  filterPrayers
};
