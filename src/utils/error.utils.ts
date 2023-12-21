import { Error } from 'mongoose';

export function errorHandler(err: Error | any) {
  let message = '';
  console.log('error: ', err);
  if (err.code === 11000) {
    const fields = [];
    for (const key in err.keyValue) {
      fields.push(err.keyValue[key]);
    }
    message = `${fields.join(',')} уже существует !`;
  } else {
    message = err.message;
  }
  return message;
}
