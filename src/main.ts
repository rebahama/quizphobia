import './scss/style.scss'; // Importera huvud-SCSS-filen

/******************************************************
 * ************ Variables ****************************
 *****************************************************/

/*                      const                    */




/*                      let                      */

let score = 0;

// let answerTime = ;     - Variable to use for the time it takes for user to answer question
// let wrongAnswer = ;    - Boolean to use for wrong answer



/******************************************************
 * ************ Functions ****************************
 *****************************************************/

function getPointsForAnsweringQuestion(answerTime: number, wrongAnswer: boolean): void {
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

}

getPointsForAnsweringQuestion(answerTime, wrongAnswer); // passing the answerTime for each question as an argument 


/******************************************************
 * ************ Eventlisteners ****************************
 *****************************************************/