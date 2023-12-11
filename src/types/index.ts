export enum FFPayloadType {
  START_GAME = 'START_GAME',
  NEXT_QUESTION = 'NEXT_QUESTION',
  RESET_GAME = 'RESET_GAME',
  OPEN_ANSWER = 'OPEN_ANSWER',
  SOUND_APPLAUSE = 'SOUND_APPLAUSE',
  SOUND_INCORRECT = 'SOUND_INCORRECT',
  SOUND_INCORRECT_ALL = 'SOUND_INCORRECT_ALL',
  BEGIN_CLOCK = 'BEGIN_CLOCK',
  STOP_CLOCK = 'STOP_CLOCK',
  WINNER = 'WINNER',
  TEAM_A_PLAY = 'TEAM_A_PLAY',
  TEAM_B_PLAY = 'TEAM_B_PLAY',
}

export interface FFPayloadStartGame {
  type: FFPayloadType.START_GAME;
  payload: {
    question: FFQuestionItem;
  };
}

export interface FFPayloadNextQuestion {
  type: FFPayloadType.NEXT_QUESTION;
  payload: {
    question: FFQuestionItem;
  };
}

export interface FFPayloadResetGame {
  type: FFPayloadType.RESET_GAME;
}

export interface FFPayloadOpenAnswer {
  type: FFPayloadType.OPEN_ANSWER;
  payload: {
    answerId: number;
  };
}

export interface FFPayloadBeginClock {
  type: FFPayloadType.BEGIN_CLOCK;
}

export interface FFPayloadStopClock {
  type: FFPayloadType.STOP_CLOCK;
}

export interface FFPayloadSoundApplause {
  type: FFPayloadType.SOUND_APPLAUSE;
}

export interface FFPayloadSoundIncorrect {
  type: FFPayloadType.SOUND_INCORRECT;
}

export interface FFPayloadSoundIncorrectAll {
  type: FFPayloadType.SOUND_INCORRECT_ALL;
}

export interface FFPayloadTeamAPlay {
  type: FFPayloadType.TEAM_A_PLAY;
}

export interface FFPayloadTeamBPlay {
  type: FFPayloadType.TEAM_B_PLAY;
}

export interface FFPayloadWinner {
  type: FFPayloadType.WINNER;
  payload: {
    teamName: string;
  };
}

export type FFPayload =
  | FFPayloadStartGame
  | FFPayloadNextQuestion
  | FFPayloadResetGame
  | FFPayloadOpenAnswer
  | FFPayloadBeginClock
  | FFPayloadStopClock
  | FFPayloadSoundApplause
  | FFPayloadSoundIncorrect
  | FFPayloadSoundIncorrectAll
  | FFPayloadTeamAPlay
  | FFPayloadTeamBPlay
  | FFPayloadWinner;

interface FFQuestionItem {
  question: string;
  answers: {
    answer: string;
    value: number;
  }[];
}

export type FFQuestions = FFQuestionItem[];
