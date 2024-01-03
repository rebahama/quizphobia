export interface IQuestionObject {
  id: number;
  question: string;
  answers: string[];
  correct_answer: string;
}

export interface IStoredUserType {
  user: string | null;
}

export interface IHighScoreObject {
  user: string | null;
  highscore: number;
}