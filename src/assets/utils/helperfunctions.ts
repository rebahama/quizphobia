import type { IQuestionObject, IStoredUserType } from './types';

/**
 * getter function that returns an array of objects from localStorage after parsing the stored data
 * @param arrayOfOjbects array of objects as declared in localStorage
 * @param storageName stored name given to the stored array of type string
 * @returns array of objects of type IStoredUserType[];
 */
export function getArrayOfObjectsFromLocalStorage(
  arrayOfOjbects: IStoredUserType[],
  storageName: string
): IStoredUserType[] {
  // getting stored data in JSON.format
  const storedData = localStorage.getItem(storageName);
  // if there is not storedData arrayOfObjects should be empty, else parse the JSON string
  arrayOfOjbects = storedData === null ? [] : JSON.parse(storedData);
  return arrayOfOjbects;
}

export function getRandomQuestions(jsonArray: IQuestionObject[], numQuestions: number): IQuestionObject[] {
  return [...jsonArray].sort(() => Math.random() - 0.5).slice(0, numQuestions);
}

