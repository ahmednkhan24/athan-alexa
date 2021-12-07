import moment, { Moment } from 'moment-timezone';

export const subtractAndFormat = (momentTime: Moment, minutesToSubtract = 0) =>
  momentTime
    .subtract(minutesToSubtract, 'minutes')
    .format('YYYY-MM-DDTHH:mm:ss');

export const createMomentTime = (time: string) => {
  const [hour, minute] = time.split(':');

  const momentTime = moment()
    .tz('America/Chicago')
    .set({
      hour: parseInt(hour),
      minute: parseInt(minute),
      seconds: parseInt('00')
    });

  return subtractAndFormat(momentTime);
};

export const createMomentObject = (time: string): Moment => moment(time);
