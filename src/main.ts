import './scss/style.scss'; // Importera huvud-SCSS-filen

/******************************************************
 * ************ Variables ****************************
 *****************************************************/

/*                      const                    */




/*                      let                      */

let score = 0;



/******************************************************
 * ************ Functions ****************************
 *****************************************************/

function getPointsForAnsweringQuestion(answerTime: number): void {
  if (answerTime > 5) {
    score = score + 150;
  } else if (answerTime < 5 && answerTime > 10) {
    score += 125;
  } else if (answerTime < 10 && answerTime > 15) {
    score += 100;
  } else {
    score += 50;
  }
}



getPointsForAnsweringQuestion(answerTime); // passing the answerTime for each question as an argument 


/******************************************************
 * ************ Eventlisteners ****************************
 *****************************************************/