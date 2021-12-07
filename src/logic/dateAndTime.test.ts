import {
  createMomentObject,
  createMomentTime,
  subtractAndFormat
} from './dateAndTime';

describe('dateAndTime', () => {
  it('createMomentTime hour < 12', () => {
    const actual = createMomentTime('06:18');

    // YYYY-MM-DDT06:18:00
    expect(typeof actual).toEqual('string');

    const date = new Date(actual);
    expect(date.getHours()).toEqual(6);
    expect(date.getMinutes()).toEqual(18);
    expect(date.getMilliseconds()).toEqual(0);
  });

  it('createMomentTime hour >= 12', () => {
    const actual = createMomentTime('20:58');

    // YYY-MM-DDT20:58:00
    expect(typeof actual).toEqual('string');

    const date = new Date(actual);
    expect(date.getHours()).toEqual(20);
    expect(date.getMinutes()).toEqual(58);
    expect(date.getMilliseconds()).toEqual(0);
  });

  it('subtractAndFormat 0 minutes', () => {
    const time = createMomentObject(createMomentTime('11:30'));
    const actual = subtractAndFormat(time);

    const date = new Date(actual);
    expect(date.getHours()).toEqual(11);
    expect(date.getMinutes()).toEqual(30);
    expect(date.getMilliseconds()).toEqual(0);
  });

  it('subtractAndFormat 25 minutes', () => {
    const time = createMomentObject(createMomentTime('11:30'));
    const actual = subtractAndFormat(time, 25);

    const date = new Date(actual);
    expect(date.getHours()).toEqual(11);
    expect(date.getMinutes()).toEqual(5);
    expect(date.getMilliseconds()).toEqual(0);
  });
});
