import type { IStoredUserType } from './types';

/**
 * getter function that returns an array of objects from localStorage after parsing the stored data
 * @param arrayOfOjbects array of objects as declared in localStorage
 * @param storageName stored name given to the stored array
 * @returns array of objects
 */
export function getArrayOfObjectsFromLocalStorage(
  arrayOfOjbects: IStoredUserType[],
  storageName: string
): IStoredUserType[] {
  // getting storedData in JSON.format
  const storedData = localStorage.getItem(storageName);
  // if there is not storedData arrayOfObjects should be empty
  if (storedData === null) {
    arrayOfOjbects = [];
  } else {
    // parsing the JSON string to the array of objects
    arrayOfOjbects = JSON.parse(storedData);
  }
  return arrayOfOjbects;
}
