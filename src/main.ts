import './styles/style.scss'; // Importera huvud-SCSS-filen
import array from './json/quiz.json';
import type { IQuestionObject } from './assets/utils/types.ts';



/******************************************************
 * ************ Variables ****************************
 *****************************************************/

/*                      const                    */

const answerTime = 5;    // - Variable to use for the time it takes for user to answer question 
const wrongAnswer = true; //  - Boolean to use for wrong answer
const questionArray: IQuestionObject[] = (array as any);


/*                      let                      */

let score = 0;




/******************************************************
 * ************ Functions ****************************
 *****************************************************/

function getPointsForAnsweringQuestion(answerTime: number, wrongAnswer: boolean): number {
  if (wrongAnswer) {
    score -= 30;
    console.log(score);
  } else if (answerTime < 5) {
    score = score + 150;
    console.log(score);
  } else if (answerTime >= 5 && answerTime < 10) {
    score += 125;
    console.log(score);
  } else if (answerTime >= 10 && answerTime < 15) {
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