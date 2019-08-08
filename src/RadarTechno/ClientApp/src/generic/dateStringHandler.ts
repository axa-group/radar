import { DateTime } from 'luxon';

const dateTimeReviver = (value) => {
  let a;
  if (typeof value ==='string') {
    a = /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)*/.exec(value);
    if (a) {
      return new Date(value);
    }
  }
  return value;
};

export const convertStringDateToDateObject = (origin) => {
  if (typeof origin ==='string') {
    return dateTimeReviver(origin);
  }
  for (const propertyName in origin) {
    if (typeof origin[propertyName] ==='string') {
      origin[propertyName] = dateTimeReviver(origin[propertyName]);
    } else if (typeof origin[propertyName] === 'object') {
      convertStringDateToDateObject(origin[propertyName]);
    }
  }
  return origin;
};

export const dateObjectToString = (date) => {
  const dateTime = DateTime.fromJSDate(date);
  return dateTime.invalid ? date : dateTime.toFormat('dd LLL yyyy hh:mm:ss');
};
