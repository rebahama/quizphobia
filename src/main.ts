import './scss/style.scss'; // Importera huvud-SCSS-filen
import array from './quiz.json';
import type { IQuestionObject } from './types';
/**
 * under progress
 */
const questionArray: IQuestionObject[] = (array as any);


questionArray.forEach((element: any) => {
  console.log(element.answers);
    
});