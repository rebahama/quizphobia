import './styles/style.scss'; // Importera huvud-SCSS-filen
import array from './json/quiz.json'; // Importing json file to array for using to randomize questions.
import { getArrayOfObjectsFromLocalStorage } from './assets/utils/helperfunctions.ts';
import type { IQuestionObject, IStoredUserType } from './assets/utils/types.ts'; // importing interface

/******************************************************
 * ************ Selectors ****************************
 *****************************************************/

const startButton = document.querySelector('#startButton');

/******************************************************
 * ************ Variables ****************************
 *****************************************************/

/*                      const                    */

const answerTime = 5; // - Variable to use for the time it takes for user to answer question
const wrongAnswer = false; //  - Boolean to use for wrong answer
const questionArray: IQuestionObject[] = []; // array with interface to put random questions in.

/*                      let                      */

let storedUsers: IStoredUserType[];
/* let selectedUser: string | null = null; use this when logic for selectedUser is in place */
const selectedUser: string | null = 'Matthias'; // placeholder for now to handle logic
let score = 0;

console.log('originalArray: ', array);
console.log('questionArray: ', questionArray);
console.log('selectedUser: ', selectedUser);

/******************************************************
 * ************ Functions ****************************
 *****************************************************/

function doesUserExistInArray(users: IStoredUserType[], username: string | null): boolean {
  return users.some(userObject => {
    if (userObject.user === null) {
      return false;
    }
    return userObject.user.toLowerCase() === username?.toLowerCase();
  });
}

function addUserToLocaleStorage(userName: string | null): void {
  const existingUsers = getArrayOfObjectsFromLocalStorage(storedUsers, 'users');
  // type checking if userName is null or if the user already exists in array, if so return
  if (userName === null || doesUserExistInArray(existingUsers, userName)) {
    return;
  }
  // create new user object
  const newUser = {
    id: existingUsers.length,
    user: userName,
  };
  // if existingUsers array is empty, then create an array with the newly create user and stringify it
  if (existingUsers.length === 0) {
    console.log('new user!');
    localStorage.setItem('users', JSON.stringify([newUser]));
  } else {
    // if the existingUsers array already is in localStorage, push the new User to that array
    console.log('user already exist!');
    existingUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(existingUsers));
  }
}

function getPointsForAnsweringQuestion(answerTime: number, wrongAnswer: boolean): number {
  if (wrongAnswer) {
    score -= 30;
    console.log(score);
  } else if (answerTime < 5) {
    score = score + 150;
    console.log('under five');
  } else if (answerTime < 10) {
    score += 125;
    console.log('under ten');
  } else if (answerTime < 15) {
    score += 100;
    console.log('under 15');
  } else {
    score += 50;
    console.log('to slow');
  }
  return score;
}

console.log('score:', score);
getPointsForAnsweringQuestion(answerTime, wrongAnswer); // passing the answerTime for each question as an argument

/******************************************************
 * ************ Eventlisteners ****************************
 *****************************************************/

startButton?.addEventListener('click', () => {
  addUserToLocaleStorage(selectedUser);
});

console.log(startButton);
