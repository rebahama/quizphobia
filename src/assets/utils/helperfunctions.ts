import type { IStoredUserType } from './types';

/**
 * getter function that returns arrayOfObjects from localStorage
 * @param arrayOfOjbects arrayOfObjects as declared in localStorage
 * @param storageName name that has been giving to the array
 * @returns
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
