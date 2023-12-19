import './scss/style.scss'; // Importera huvud-SCSS-filen
import array from './quiz.json';

/**
 * under progress
 */
const questionArray = (array as any);


questionArray.forEach((element: any) => {
  console.log(element.answers);
    
});