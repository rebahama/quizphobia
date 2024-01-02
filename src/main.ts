import './styles/style.scss'; // Importera huvud-SCSS-filen
import array from './json/quiz.json'; // Importing json file to array for using to randomize questions.
import {
  getArrayOfObjectsFromLocalStorage,
  getRandomQuestions,
  getFractionAsString
} from './assets/utils/helperfunctions.ts';
import type { IQuestionObject, IStoredUserType } from './assets/utils/types.ts'; // importing interface

/******************************************************
 * ************ Selectors ****************************
 *****************************************************/

const userButtonsContainer = document.querySelector('#buttonContainer');
const startButton = document.querySelector('#startButton');
const mainTimerContainer: HTMLElement | null =
  document.querySelector('#mainTimer');
const questionNumberText = document.querySelector('#questionNumber');
const questionContainer = document.querySelector('#questionContainer');
const playerInput = document.querySelector('#name') as HTMLInputElement;

/******************************************************
 * ************ Variables ****************************
 *****************************************************/

/*                      const                    */

const answerTime = 5; // - Variable to use for the time it takes for user to answer question
const wrongAnswer = false; //  - Boolean to use for wrong answer

const questionArray = getRandomQuestions(array, 10);
let storedUsers: IStoredUserType[];
let selectedUser: string | null = null;
const currentQuestionNumber = 1;
let isAnswerCorrect = false;
let score = 0;

//  Variables for mainInterval
let clearTimeMainInterval;
let clearTimeQuestionInterval: number;
let mainSeconds = 0;
let mainMinutes = 0;
let mainSecs;
let mainMins;

//  variables for questionInterval
let questionSeconds = 0;
let questionMinutes = 0;

console.log('originalArray: ', array);
console.log('questionArray: ', questionArray);
console.log('selectedUser: ', selectedUser);

/******************************************************
 * ************ Functions ****************************
 *****************************************************/

/**
 * Generates the question and updates question number in header
 * @param array type IQuestionObject[]
 * @param currentQuestionText text in the header for the current question of type Element | null
 */
function checkNextQuestion(
  array: IQuestionObject[],
  currentQuestionText: Element | null
): void {
  // resetting isAnswerCorrect to false / can be placed in other places aswell
  isAnswerCorrect = false;

  /**
   * Timer for questionInterval.
   *  clear when answered clearInterval(clearTimeQuestionInterval)
   *  - answerTime = questionSeconds;
   *  - wrongAnswer (true/false)
   * - call function getPointsForAnsweringQuestions(answerTime, isAnswerCorrect)
   *    - Send in parameters for answerTime and isAnswerCorrects.
   * */
  setTimeout(setQuestionInterval, 1000);

  if (currentQuestionText !== null) {
    currentQuestionText.textContent = getFractionAsString(
      currentQuestionNumber,
      questionArray.length
    );
  }
  const currentQuestionObject = array[currentQuestionNumber - 1];
  generateQuestionInHTML(currentQuestionObject, questionContainer);
}

/**
 * Generates the question and answers in HTML
 * @param currentQuestionObject type IQuestionObject
 * @param questionContainer container for the question and answers
 * @returns void
 */
function generateQuestionInHTML(
  currentQuestionObject: IQuestionObject,
  questionContainer: Element | null
): void {
  if (questionContainer === null) {
    return;
  }
  // deconstruct and get values from the object to dynamically render in html
  const { question, answers } = currentQuestionObject;
  questionContainer.innerHTML = `
    <div>
      <h2>Question</h2>
      <p>${question}</p>
    </div>
    <div class="question-list" id="questionList">
    </div>
  `;
  const questionListContainer = document.querySelector('#questionList');
  // iterates all the answers and appends each to the buttonlist container
  answers.forEach((answer) => {
    const answerButton = document.createElement('button');
    answerButton.textContent = answer;
    questionListContainer?.append(answerButton);
  });
}

/**
 * Disables user buttons and visually representing this based on if an input has a value
 * @param input HTMLInputElement type
 * @param userButtonsContainer Element | null
 */

/**
 * Handles when the user clicks the existing user buttons, toggeling active classes on the target
 * @param event click event
 * @param input type HTMLInputElement
 * @returns void
 */
function handleClickOnUser(event: Event, input: HTMLInputElement): void {
  const target = event.target as HTMLElement;
  const isTargetUserButton =
    target.tagName === 'BUTTON' && target.classList.contains('intro-buttons');
  // if input is not empty or the target is not a valid user button exit function
  console.log(input.value.length > 0);
  console.log(isTargetUserButton);
  if (input === null || input.value.length > 0 || !isTargetUserButton) {
    return;
  }

  // if target already is active toggle class change for only that button
  if (target.classList.contains('button-active')) {
    target.classList.toggle('button-active');
  } else {
    // if target is not active first remove active classes from all buttons before adding class
    const listItems = userButtonsContainer?.querySelectorAll('.intro-buttons');
    console.log(listItems);
    listItems?.forEach((item) => {
      item.classList.remove('button-active');
    });
    target.classList.toggle('button-active');
  }
  // set selected user to the text of the targeted button
  if (target.textContent !== null) {
    selectedUser = target.textContent;
  }
  console.log('selectedUser:', selectedUser);
}

function disableUserButtonsIfInputIsFilled(
  input: HTMLInputElement,
  userButtonsContainer: Element | null
): void {
  const userButtons = userButtonsContainer?.querySelectorAll('.intro-buttons');
  const isInputFilled = input.value.length > 0;
  // if input has value add disabled and a class to visually show this
  userButtons?.forEach((button) => {
    if (isInputFilled) {
      button.classList.toggle('button-inactive', true);
      button.classList.toggle('button-active', false);
    } else {
      // textbox is empty, remove inactive and don´t add active 
      button.classList.toggle('button-inactive', false);
      button.classList.toggle('button-active', false);
    }
  });
  selectedUser = input.value;
  console.log('selectedUser: ', selectedUser);
}

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

function setMainInterval(): void {
  if (mainTimerContainer === null) {
    return;
  }

  if (mainSeconds === 60) {
    // if seconds reach 60 - add 1 to mainMinutes
    mainSeconds = 0;
    mainMinutes = mainMinutes + 1;
  }

  mainSecs = mainSeconds < 10 ? `0${mainSeconds}` : mainSeconds;
  mainMins = mainMinutes < 10 ? `0${mainMinutes}:` : `${mainMinutes}+:`;

  mainTimerContainer.innerHTML = mainMins + mainSecs;
  mainSeconds++;

  clearTimeMainInterval = setTimeout(setMainInterval, 1000);
}

function setQuestionInterval(): void {
  if (questionSeconds === 60) {
    questionSeconds = 0;
    questionMinutes = questionMinutes + 1;
  }
  questionSeconds++;

  clearTimeQuestionInterval = setTimeout(setQuestionInterval, 1000);
  console.log(questionSeconds);
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
  // THESE SHOULD BE IN THE STARTGAME FUNCTION LATER
  addUserToLocalStorage(selectedUser);
  checkNextQuestion(questionArray, questionNumberText);
  setTimeout(setMainInterval, 1000); // mainInterval - clearInterval(clearTimeMainInterval) when quiz is done.
});
userButtonsContainer?.addEventListener('click', (e) => {
  handleClickOnUser(e, playerInput);
});
playerInput.addEventListener('input', () => {
  disableUserButtonsIfInputIsFilled(playerInput, userButtonsContainer);
});

console.log(startButton);

/******************************************************
 * ************ Execution ****************************
 *****************************************************/
