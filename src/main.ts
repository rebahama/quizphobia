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

function getPointsForAnsweringQuestion(answerTime: number, wrongAnswer: boolean): void {
  if (answerTime < 5) {
    score = score + 150;
   
  } else if (answerTime >= 5 && answerTime < 10) {
    score += 125;
    
  } else if (answerTime >= 10 && answerTime < 15) {
    score += 100;
    
  } else {
    score += 50;
  }
  if (wrongAnswer) {
    score -= 30;
  }
}



getPointsForAnsweringQuestion(answerTime, wrongAnswer); // passing the answerTime for each question as an argument 


/******************************************************
 * ************ Eventlisteners ****************************
 *****************************************************/