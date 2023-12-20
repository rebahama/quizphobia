import './scss/style.scss'; // Importera huvud-SCSS-filen
import typescriptLogo from './assets/images/typescript.svg'; // Exempel på hur ni importerar bilder
import { sortArrayByText } from './assets/utils/helpers'; // Exempel på hur ni importerar en funktion från en annan fil

import array from './quiz.json';
import type { IQuestionObject } from './types';
/**
 * under progress
 */
const questionArray: IQuestionObject[] = (array as any);


questionArray.forEach((element: any) => {
  console.log(element.answers);
    
});