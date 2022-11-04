import * as t from 'io-ts';
import { isRight, toError } from 'fp-ts/lib/Either';

export const decode = <T>(value: T, type: t.Type<T, any>): T => {
  if (value) {
    const result = type.decode(value);
    if (isRight(result)) {
      return result.right;
    } else {
      throw toError(result.left);
    }
  } else {
    return value;
  }
};
