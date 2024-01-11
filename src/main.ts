import './styles/style.scss';
import array from './json/quiz.json';
import {
  getArrayOfObjectsFromLocalStorage,
  getRandomQuestions,
  getFractionAsString,
  getLinearGradienceLeftToRightAsString,
  getHighScoreFromLocalStorage,
  toggleAddClassNameOnElement,
  initialTheme,
  setTheme,
} from './assets/utils/helperfunctions.ts';
import type { IQuestionObject, IStoredUserType, IHighScoreObject } from './assets/utils/types.ts';

import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
gsap.registerPlugin(Flip);

/******************************************************
 * ************ Selectors ****************************
 *****************************************************/

const themeSwitch = document.querySelector('#themeSwitcher');
const headerResultsPanel = document.querySelector('#resultsPanel');
const endScreenButtonsContainer = document.querySelector('#finishedButtonsBox');
const startButton = document.querySelector('#startButton');
const mainTimerContainer: HTMLElement | null = document.querySelector('#mainTimer');
const questionNumberText = document.querySelector('#questionNumber');
const questionContainer = document.querySelector('#questionContainer');
const startContainer = document.querySelector('#startContainer');
const highScoreContainer = document.querySelector('#centerTextHighscoreContainer');
const finishQuizContainer = document.querySelector('#quizFinished');
const quizContainer = document.querySelector('#questionSection');
const introHeading = document.querySelector('#introHeading');
const topBannerHeading = document.querySelector('#topBanner');
const questionAndProgressBarContainer = document.querySelector('#questionSection');
const playerInput = document.querySelector('#name') as HTMLInputElement;
const progressBar = document.querySelector('#progressBar') as HTMLElement;
const userErrorMessage = document.querySelector('#errorMessage');
let userButtonsContainer = document.querySelector('#buttonContainer');

/******************************************************
 * ************ Variables ****************************
 *****************************************************/

// arrays
const highScoreArray: IHighScoreObject[] = [];
let questionArray = getRandomQuestions(array, 10);
let storedHighScore: IHighScoreObject[];
let storedUsers: IStoredUserType[];
// booleans
let isAnswerCorrect = false;
// user
let selectedUser: string | null = null;

let currentQuestionNumber = 1;
let questionScore = 0;
let highscore = 0;
let rightCount = 0;
// intervals
let clearTimeMainInterval: number;
let clearTimeQuestionInterval: number;
// main timer
let mainSeconds = 0;
let mainMinutes = 0;
let mainSecs: string | number;
let mainMins: string | null;
// question timer
let questionSeconds = 0;
let questionMinutes = 0;

/******************************************************
 * ************ Functions ****************************
 *****************************************************/

/**
 * Function that handles click event delegation for the menu, restart game buttons
 * @param event click Event
 * @returns void
 */
function handleClickOnEndButtons(event: Event): void {
  const target = event.target as HTMLElement;
  if (target.tagName !== 'BUTTON') {
    return;
  }
  if (target.id === 'mainMenuButton') {
    // resets user back to empty
    selectedUser = null;
    startContainer?.classList.remove('hidden');
    highScoreContainer?.classList.remove('hidden');
    userButtonsContainer = document.querySelector('#buttonContainer');
    generateExistingUsersInHTML(userButtonsContainer);
    displayHighscoreStartGame();
  } else if (target.id === 'restartQuizButton') {
    startGame(selectedUser);
  }
  // generate new random array
  questionArray = getRandomQuestions(array, 10);
  finishQuizContainer?.classList.add('hidden');
  clearInterval(clearTimeMainInterval);
}

function updateDisplayForProgressBar(): void {
  const currentTheme = localStorage.getItem('theme');
  const firstColor = currentTheme === 'light-mode' ? '#9675bf' : '#212f45';
  const secondColor = currentTheme === 'light-mode' ? '#f0f0f0' : '#d9d9d9';
  progressBar.style.background = getLinearGradienceLeftToRightAsString(
    currentQuestionNumber * 10,
    firstColor,
    secondColor
  );
}

/**
 * Generates the question and updates question number in header
 * @param array type IQuestionObject[]
 * @param currentQuestionText text in the header for the current question of type Element | null
 */
function checkNextQuestion(array: IQuestionObject[], currentQuestionText: Element | null): void {
  isAnswerCorrect = false;
  if (progressBar === null) {
    return;
  }
  // taking question number as percentage in the progressbar to get linear gradient
  updateDisplayForProgressBar();
  questionScore = 0;
  questionSeconds = 0;
  clearInterval(clearTimeQuestionInterval);
  setTimeout(setQuestionInterval, 1000);

  if (currentQuestionText !== null) {
    currentQuestionText.textContent = getFractionAsString(currentQuestionNumber, questionArray.length);
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
function generateQuestionInHTML(currentQuestionObject: IQuestionObject, questionContainer: Element | null): void {
  if (questionContainer === null) {
    return;
  }
  const { question, answers } = currentQuestionObject;
  // randomize how the answers will be positions to not be memorized by user
  const randomAnswersArray = [...answers].sort(() => Math.random() - 0.5).slice(0, answers.length);
  questionContainer.innerHTML = `
  <div>
    <div>
      <div class="countdown-container" id="countdownContainer">
        <svg class="countdown-circle" id="countdownCircle" width="80" height="80">
        <circle cx="40" cy="40" r="35" stroke="#006466" stroke-width="4" fill="none" />
        </svg>
      <div class="countdown-text" id="countdownText">30</div>
    </div>
    </div>
      <p>${question}</p>
    </div>
    <div class="question-list" id="questionList">
  </div>
`;
  const questionListContainer = document.querySelector('#questionList');
  randomAnswersArray.forEach(answer => {
    const answerButton = document.createElement('button');
    answerButton.textContent = answer;
    questionListContainer?.append(answerButton);
  });
}

function displayHighscoreStartGame(): void {
  const storedHighScoreArray = getHighScoreFromLocalStorage(storedHighScore, 'highscores');
  const listScoreOutput = document.querySelectorAll('.list-score-output li');

  storedHighScoreArray.sort((a, b) => b.playedHighscore - a.playedHighscore);
  storedHighScoreArray.slice(0, 10).forEach((highscore, index) => {
    const { user, playedHighscore } = highscore;
    listScoreOutput[index].textContent = `${index + 1}. ${user} ${playedHighscore}p`;
  });
}

/**
 * Handles when the user clicks the existing user buttons, toggeling active classes on the target
 * @param event click event
 * @param input type HTMLInputElement
 * @returns void
 */
function handleClickOnUser(event: Event, input: HTMLInputElement): void {
  const target = event.target as HTMLElement;
  const isTargetUserButton = target.tagName === 'BUTTON' && target.classList.contains('intro-buttons');
  if (input === null || input.value.length > 0 || !isTargetUserButton) {
    return;
  }

  // if target already is active toggle class change for only that button
  if (target.classList.contains('button-active')) {
    target.classList.toggle('button-active');
  } else {
    // if target is not active first remove active classes from all buttons before adding class
    const listItems = userButtonsContainer?.querySelectorAll('.intro-buttons');
    listItems?.forEach(item => {
      item.classList.remove('button-active');
    });
    target.classList.toggle('button-active');
  }
  if (target.textContent !== null && target.classList.contains('button-active')) {
    selectedUser = target.textContent;
  } else {
    selectedUser = null;
  }
  userErrorMessage?.classList.add('hidden');
}

/**
 * Disables user buttons and visually representing this based on if an input has a value
 * @param input HTMLInputElement type
 * @param userButtonsContainer Element | null
 */
function disableUserButtonsIfInputIsFilled(input: HTMLInputElement, userButtonsContainer: Element | null): void {
  const userButtons = userButtonsContainer?.querySelectorAll('.intro-buttons');
  const isInputFilled = input.value.length > 0;
  userButtons?.forEach(button => {
    if (isInputFilled) {
      button.classList.toggle('button-inactive', true);
      button.classList.toggle('button-active', false);
    } else {
      button.classList.toggle('button-inactive', false);
      button.classList.toggle('button-active', false);
    }
  });
  userErrorMessage?.classList.add('hidden');
  selectedUser = isInputFilled ? input.value : null;
}

/**
 * Generating existing users from local storage as HTML
 * @param userButtonsContainer button container for users of type Element | null
 * @returns void
 */
function generateExistingUsersInHTML(userButtonsContainer: Element | null): void {
  const existingUsersArray = getArrayOfObjectsFromLocalStorage(storedUsers, 'users');
  if (userButtonsContainer === null || !(existingUsersArray.length > 0)) {
    return;
  }
  userButtonsContainer.innerHTML = '';
  existingUsersArray.forEach(user => {
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
function doesUserExistInArray(users: IStoredUserType[], userName: string | null): boolean {
  return users.some(userObject => {
    if (userObject.user === null) {
      return false;
    }
    // returnss if the selected user corresponds to the userObject user string;
    return userObject.user.toLowerCase() === userName?.toLowerCase();
  });
}

/**
 * Adds user to local storage
 * @param userName userName of type string
 * @returns void
 */
function addUserToLocalStorage(userName: string | null): void {
  const currentUsersArray = getArrayOfObjectsFromLocalStorage(storedUsers, 'users');
  if (userName === null || doesUserExistInArray(currentUsersArray, userName)) {
    return;
  }
  const newUser = {
    id: currentUsersArray.length,
    user: userName,
  };
  // if currentUsersArray array is empty, then create an array with the newly create user
  if (currentUsersArray.length === 0) {
    localStorage.setItem('users', JSON.stringify([newUser]));
  } else {
    // if the currentUsersArray array already is in localStorage, push the new User to that array
    currentUsersArray.push(newUser);
    localStorage.setItem('users', JSON.stringify(currentUsersArray));
  }
}

function addHighscoreToLocalStorage(highScoreArray: IHighScoreObject[], selectedUser: string | null): void {
  const storedHighScoreArray = getHighScoreFromLocalStorage(storedHighScore, 'highscores');

  const newHighscore = {
    user: selectedUser,
    playedHighscore: highscore,
  };

  if (storedHighScoreArray.length === 0) {
    localStorage.setItem('highscores', JSON.stringify(highScoreArray));
  } else {
    storedHighScoreArray.push(newHighscore);
    localStorage.setItem('highscores', JSON.stringify(storedHighScoreArray));
  }
  displayHighScoreAfterQuizFinished(finishQuizContainer, questionAndProgressBarContainer);
}

/**
 * Handles logic for clicking on answers with event delegation
 * @param event clickEvent
 * @param questionArray array of objects for the question with interface IQuestionObject[]
 * @returns void
 */
function handleClickOnAnswers(event: Event, questionArray: IQuestionObject[]): void {
  const buttons: HTMLButtonElement[] = Array.from(document.querySelectorAll('#questionList button'));
  const isAnyButtonTaken = Array.from(buttons).some(button => button.classList.contains('taken'));
  const target = event.target as HTMLElement;
  if (target === null || target.tagName !== 'BUTTON' || isAnyButtonTaken) {
    return;
  }
  const currentQuestionObject = questionArray[currentQuestionNumber - 1];
  const isTargetTheRightAnswer =
    target.textContent?.toLowerCase() === currentQuestionObject.correct_answer.toLowerCase();
  // adding class taken for keeping track if any answer is already clicked
  target.classList.add('taken');
  handleLogicBasedOnAnswer(target, isTargetTheRightAnswer, buttons);
  // animate score update //
  updateDisplayForNextQuestion();
  clearInterval(clearTimeQuestionInterval);
}

function handleLogicBasedOnAnswer(
  answer: HTMLElement,
  isTargetTheRightAnswer: boolean,
  buttons: HTMLButtonElement[]
): void {
  const currentTheme = localStorage.getItem('theme');
  const colorRightAnswer = currentTheme === 'light-mode' ? '#66c7ad' : '#207d73';
  const colorWrongAnswer = currentTheme === 'light-mode' ? '#c752af' : '#67073d';
  if (isTargetTheRightAnswer) {
    isAnswerCorrect = true;
    rightCount += 1;
  } else {
    isAnswerCorrect = false;
    buttons.forEach(button => {
      const htmlButton = button as HTMLElement;
      if (htmlButton.textContent?.toLowerCase() === questionArray[currentQuestionNumber - 1].correct_answer) {
        htmlButton.style.border = '3px solid #207d73';
      }
    });
  }
  // This will remove pointerevent after answering.
  buttons.forEach(button => {
    button.style.pointerEvents = 'none';
  });
  handleAnimationBasedOnAnswer(isAnswerCorrect, answer, colorRightAnswer, colorWrongAnswer);
  updateScoreAndHighscoreBasedOnAnswer();
  animatePointUpdate(isAnswerCorrect, colorRightAnswer, colorWrongAnswer);
}

function handleAnimationBasedOnAnswer(
  isAnswerCorrect: boolean,
  answer: HTMLElement,
  colorRightAnswer: string,
  colorWrongAnswer: string
): void {
  if (isAnswerCorrect) {
    gsap.to(answer, {
      duration: 1,
      backgroundColor: colorRightAnswer,
      scale: 1.5,
      ease: 'elastic',
    });
  } else {
    gsap.fromTo(
      answer,
      {
        scale: 1,
      },
      {
        ease: 'bounce.out',
        scale: 0.8,
        duration: 1,
        backgroundColor: colorWrongAnswer,
      }
    );
  }
}

function animatePointUpdate(isAnswerCorrect: boolean, colorRightAnswer: string, colorWrongAnswer: string): void {
  const animationPoint: HTMLParagraphElement | null = document.querySelector('#animationPoint');
  if (animationPoint !== null) {
    animationPoint.textContent = `${questionScore}`;
    animationPoint.classList.remove('hidden');
    animationPoint.style.color = isAnswerCorrect ? colorRightAnswer : colorWrongAnswer; 
  }
  gsap.fromTo(
    animationPoint,
    {
      y: 0,
      opacity: 100,
    },
    {
      ease: 'bounce.out',
      duration: 2,
      y: -110,
      opacity: 0,
    }
  );
}

function updateScoreAndHighscoreBasedOnAnswer(): void {
  questionScore = getPointsForAnsweringQuestion(questionSeconds, isAnswerCorrect, questionScore);
  highscore += Math.floor(questionScore);

  const highscoreBanner = document.querySelector('#currentScore');
  if (highscoreBanner !== null) {
    highscoreBanner.textContent = highscore.toString();
  }
}

function updateCountDown(): void {
  const countdownDuration = 30;
  const elapsed = questionSeconds;
  const countdownContainer = document.querySelector('#countdownContainer') as HTMLElement;
  const countdownElement = document.querySelector('#countdownCircle circle') as SVGCircleElement;
  const countdownText = document.querySelector('#countdownText') as HTMLElement;
  const circumference = 2 * Math.PI * 35;
  const remainingTime = countdownDuration - elapsed;

  if (remainingTime >= 0) {
    countdownElement.style.strokeDasharray = `${circumference} ${circumference}`;
    countdownElement.style.strokeDashoffset = circumference.toString();
    const offset = circumference - (remainingTime / countdownDuration) * circumference;
    countdownElement.style.strokeDashoffset = offset.toString();
    countdownText.textContent = Math.round(remainingTime).toString();
  } else if (remainingTime === -1) {
    highscore -= 50;
    updateDisplayForNextQuestion();
    countdownContainer.classList.add('countdown-error');
    countdownText.textContent = 'To Slow';
    const highscoreBanner = document.querySelector('#currentScore');
    if (highscoreBanner !== null) {
      highscoreBanner.textContent = highscore.toString();
    }
  }
}

function updateDisplayForNextQuestion(): void {
  if (currentQuestionNumber <= questionArray.length) {
    currentQuestionNumber += 1;
  }
  setTimeout(() => {
    if (currentQuestionNumber <= questionArray.length) {
      checkNextQuestion(questionArray, questionNumberText);
    } else if (currentQuestionNumber > questionArray.length) {
      // display End screen
      toggleAddClassNameOnElement(headerResultsPanel, 'hidden', true);
      displayHighScoreAfterQuizFinished(finishQuizContainer, questionAndProgressBarContainer);
      updateHighScoreArray(highScoreArray);
      updateUserPositionInHighScore(highScoreArray);
      displayResults();
      addHighscoreToLocalStorage(highScoreArray, selectedUser);
      clearInterval(clearTimeMainInterval);
      themeSwitch?.classList.remove('hidden');
      currentQuestionNumber = 1;
      rightCount = 0;
      highscore = 0;
      mainSeconds = 0;
      mainMinutes = 0;
      playerInput.value = '';
      if (mainTimerContainer !== null) {
        mainTimerContainer.textContent = '00:00';
      }
    }
  }, 1500);
}

/**
 * Handles logic for sending the highscore and user to an array and displaying
 * @param highScoreArray array of objects for the highscore and user with interface IHighScoreObject[]
 * @returns void
 */

function updateHighScoreArray(highScoreArray: IHighScoreObject[]): void {
  if (highScoreArray.length < 10) {
    const highScoreObject = {
      user: selectedUser,
      playedHighscore: highscore,
    };
    highScoreArray.push(highScoreObject);
  }
}

function displayResults(): void {
  const yourScoreBox = document.querySelector('#yourScore') as HTMLElement;
  const numberCorrectText = document.querySelector('#userCorrect') as HTMLElement;
  yourScoreBox.textContent = `Your score was: ${highscore}`;
  numberCorrectText.textContent = `You got ${rightCount} questions of ${questionArray.length} correct`;
}

/**
 * Handles logic for sending the highscore and user to an array and displaying
 * Sort the highscore from high to low.
 * Add score to finish score list.
 * @param highScoreArray array of objects for the highscore and user with interface IHighScoreObject[]
 * @returns void
 */
function updateUserPositionInHighScore(highScoreArray: IHighScoreObject[]): void {
  const listScoreOutput = document.querySelectorAll('.list-score-output li');
  const highScoreListOutputFinish = document.querySelectorAll('.high-score-list li');
  const storedHighScoreArray = getHighScoreFromLocalStorage(storedHighScore, 'highscores');
  if (highScoreArray.length <= 0) {
    return;
  }
  highScoreArray.sort((a, b) => b.playedHighscore - a.playedHighscore);

  storedHighScoreArray.slice(0, 10).forEach((highscore, index) => {
    const { user, playedHighscore } = highscore;
    listScoreOutput[index].textContent = `${index + 1}. ${user} ${playedHighscore}`;
    highScoreListOutputFinish[index].textContent = `${index + 1}. ${user} ${playedHighscore}`;
  });
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
  const timerFinishPage = document.querySelector('#finishTime') as HTMLElement;
  timerFinishPage.textContent = `Your Time was: ${mainMins}${mainSecs}`;

  mainTimerContainer.innerHTML = mainMins + mainSecs;
  mainSeconds += 1;

  clearTimeMainInterval = setTimeout(setMainInterval, 1000);
}

function setQuestionInterval(): void {
  if (questionSeconds === 60) {
    questionSeconds = 0;
    questionMinutes = questionMinutes + 1;
  }
  questionSeconds += 1;
  updateCountDown();
  clearTimeQuestionInterval = setTimeout(setQuestionInterval, 1000);
}

function getPointsForAnsweringQuestion(answerTime: number, rightAnswer: boolean, score: number): number {
  if (!rightAnswer) {
    score -= 30;
  } else if (answerTime < 5) {
    score = score + 150;
  } else if (answerTime < 10) {
    score += 125;
  } else if (answerTime < 15) {
    score += 100;
  } else {
    score += 50;
  }
  return score;
}

/**
 * Displays and Hides HTML containers
 * @param startContainer container for buttons and input
 * @param highScoreContainer container for showing highscore when quiz is finsihed
 * @param topBannerHeading heading that contains a timer and question number
 * @returns void
 */
function startRemoveAndHideSections(
  startContainer: Element | null,
  highScoreContainer: Element | null,
  topBannerHeading: Element | null,
  themeSwitch: Element | null
): void {
  startContainer?.classList.add('hidden');
  highScoreContainer?.classList.add('hidden');
  themeSwitch?.classList.add('hidden');
  topBannerHeading?.classList.remove('hidden');
}

/**
 * Displays and Hides HTML containers
 * @param finishQuizContainer container that shows highscore and restart, main menu button
 * @param introHeading container that shows the heading when user is on homepage
 * @param topBannerHeading heading that contains a timer and question number
 * @returns void
 */
function startRemoveAndHideSectionsSecondPart(
  finishQuizContainer: Element | null,
  introHeading: Element | null,
  quizContainer: Element | null
): void {
  finishQuizContainer?.classList.add('hidden');
  introHeading?.classList.add('hidden');
  quizContainer?.classList.remove('hidden');
}

function displayHighScoreAfterQuizFinished(
  finishQuizContainer: Element | null,
  questionAndProgressBarContainer: Element | null
): void {
  finishQuizContainer?.classList.remove('hidden');
  questionAndProgressBarContainer?.classList.add('hidden');
  const highScoreListOutputFinish = document.querySelectorAll('.high-score-list li');
  const storedHighScoreArray = getHighScoreFromLocalStorage(storedHighScore, 'highscores');

  storedHighScoreArray.sort((a, b) => b.playedHighscore - a.playedHighscore);
  storedHighScoreArray.slice(0, 10).forEach((highscore, index) => {
    const { user, playedHighscore } = highscore;
    highScoreListOutputFinish[index].textContent = `${index + 1}. ${user} ${playedHighscore}p`;
  });
}

function startGame(selectedUser: string | null): void {
  if (selectedUser !== null) {
    addUserToLocalStorage(selectedUser);
    startRemoveAndHideSections(startContainer, highScoreContainer, topBannerHeading, themeSwitch);
    startRemoveAndHideSectionsSecondPart(finishQuizContainer, introHeading, quizContainer);
    toggleAddClassNameOnElement(headerResultsPanel, 'hidden', false);
    checkNextQuestion(questionArray, questionNumberText);
    setTimeout(setMainInterval, 1000);
  } else {
    userErrorMessage?.classList.remove('hidden');
  }
}

/******************************************************
 * ************ Eventlisteners ****************************
 *****************************************************/

document.addEventListener('DOMContentLoaded', () => {
  initialTheme();
  generateExistingUsersInHTML(userButtonsContainer);
  displayHighscoreStartGame();
});
startButton?.addEventListener('click', () => {
  startGame(selectedUser);
});
userButtonsContainer?.addEventListener('click', e => {
  handleClickOnUser(e, playerInput);
});
playerInput.addEventListener('input', () => {
  disableUserButtonsIfInputIsFilled(playerInput, userButtonsContainer);
});
questionContainer?.addEventListener('click', e => {
  handleClickOnAnswers(e, questionArray);
});
endScreenButtonsContainer?.addEventListener('click', handleClickOnEndButtons);
themeSwitch?.addEventListener('click', () => {
  const currentTheme = localStorage.getItem('theme');
  currentTheme === 'light-mode' ? setTheme('dark-mode') : setTheme('light-mode');
});
