import './styles/style.scss'; // Importera huvud-SCSS-filen
import array from './json/quiz.json'; // Importing json file to array for using to randomize questions.
import type { IQuestionObject } from './assets/utils/types.ts'; // importing interface

/******************************************************
 * ************ Variables ****************************
 *****************************************************/

/*                      const                    */

const answerTime = 5; // - Variable to use for the time it takes for user to answer question
const wrongAnswer = false; //  - Boolean to use for wrong answer
const questionArray: IQuestionObject[] = []; // array with interface to put random questions in.

console.log(questionArray);

/*                      let                      */

let score = 0;

/******************************************************
 * ************ Functions ****************************
 *****************************************************/

function getRandomQuestions(jsonArray: IQuestionObject[], numQuestions: number): IQuestionObject[] {
  const shuffledArray = [...jsonArray].sort(() => Math.random() - 0.5);
  return shuffledArray.slice(0, numQuestions);
}

function getPointsForAnsweringQuestion(
  answerTime: number,
  wrongAnswer: boolean,
): number {
  if (wrongAnswer) {
    score -= 30;
    console.log(score);
  } else if (answerTime < 5) {
    score = score + 150;
    console.log(score);
  } else if (answerTime < 10) {
    score += 125;
    console.log(score);
  } else if (answerTime < 15) {
    score += 100;
    console.log(score);
  } else {
    score += 50;
    console.log(score);
  }
  return score;
}

console.log(score);
getPointsForAnsweringQuestion(answerTime, wrongAnswer); // passing the answerTime for each question as an argument

/******************************************************
 * ************ Eventlisteners ****************************
 *****************************************************/

