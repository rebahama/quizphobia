import './styles/style.scss'; // Importera huvud-SCSS-filen
import array from './json/quiz.json'; // Importing json file to array for using to randomize questions.
import {
  getArrayOfObjectsFromLocalStorage,
  getRandomQuestions
} from './assets/utils/helperfunctions.ts';
import type { IQuestionObject, IStoredUserType } from './assets/utils/types.ts'; // importing interface

/******************************************************
 * ************ Selectors ****************************
 *****************************************************/

const userButtonsContainer = document.querySelector('#buttonContainer');
const startButton = document.querySelector('#startButton');

console.log(userButtonsContainer);

/******************************************************
 * ************ Variables ****************************
 *****************************************************/

/*                      const                    */

const answerTime = 5; // - Variable to use for the time it takes for user to answer question
const wrongAnswer = false; //  - Boolean to use for wrong answer

let questionArray = getRandomQuestions(array, 10);
let storedUsers: IStoredUserType[];
let selectedUser: string | null = null;
let currentQuestionNumber = 0;
let isAnswerCorrect = false;
let score = 0;

console.log('originalArray: ', array);
console.log('questionArray: ', questionArray);
console.log('selectedUser: ', selectedUser);

/******************************************************
 * ************ Functions ****************************
 *****************************************************/

/**
 *
 * Generating existing users from local storage as HTML
 * @param userButtonsContainer button container for users of type Element | null
 * @returns void
 */
function generateExistingUsersInHTML(
  userButtonsContainer: Element | null
): void {
  // get an array of existing users from localstorage with a helperfunction
  const existingUsersArray = getArrayOfObjectsFromLocalStorage(
    storedUsers,
    'users'
  );
  // if there are not existing users in the array from localstorage exit the function
  if (userButtonsContainer === null || !(existingUsersArray.length > 0)) {
    return;
  }
  userButtonsContainer.innerHTML = '';
  // creating and appending the existing users
  existingUsersArray.forEach((user) => {
    const userButton = document.createElement('button');
    userButton.classList.add('intro-buttons');
    userButton.textContent = user.user;
    userButtonsContainer.append(userButton);
  });
}

/**
 * Function for checking if an user already exist in an array using the some array method
 * @param users existing users (array of objects) in interface type IStoredUserType[]
 * @param userName userName of type string
 * @returns boolean if the userName string is the same as the string in the stored users
 */
function doesUserExistInArray(
  users: IStoredUserType[],
  userName: string | null
): boolean {
  return users.some((userObject) => {
    // if userObject.user does not exist in this array return false
    if (userObject.user === null) {
      return false;
    }
    // return a boolean where we are checking if the selected user corresponds to the userObject user string;
    return userObject.user.toLowerCase() === userName?.toLowerCase();
  });
}

/**
 * Adds user to local storage
 * @param userName userName of type string
 * @returns void
 */
function addUserToLocalStorage(userName: string | null): void {
  const currentUsersArray = getArrayOfObjectsFromLocalStorage(
    storedUsers,
    'users'
  );
  // type checking if userName is null or if the user already exists in array, if so return
  if (userName === null || doesUserExistInArray(currentUsersArray, userName)) {
    return;
  }
  // create an object for the newUser
  const newUser = {
    id: currentUsersArray.length,
    user: userName
  };
  // if currentUsersArray array is empty, then create an array with the newly create user and stringify it
  if (currentUsersArray.length === 0) {
    console.log('new user!');
    localStorage.setItem('users', JSON.stringify([newUser]));
  } else {
    // if the currentUsersArray array already is in localStorage, push the new User to that array
    console.log('user already exist!');
    currentUsersArray.push(newUser);
    localStorage.setItem('users', JSON.stringify(currentUsersArray));
  }
}

function getPointsForAnsweringQuestion(
  answerTime: number,
  wrongAnswer: boolean
): number {
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

document.addEventListener('DOMContentLoaded', () => {
  generateExistingUsersInHTML(userButtonsContainer);
});
startButton?.addEventListener('click', () => {
  addUserToLocalStorage(selectedUser);
});

console.log(startButton);
/******************************************************
 * ************ Execution ****************************
 *****************************************************/
