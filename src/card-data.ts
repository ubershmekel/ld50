/*
  * Mental health - mh
  * Manager sentiment - mgr
  * Friend sentiment - fr
  * Money - money
  * OKR Progress - prog
*/

export const resourceKeys = ['mh', 'mgr', 'fr', 'money', 'time'];

export interface CardData {
  title: string;
  mh?: number;
  mgr?: number;
  fr?: number;
  money?: number;
  // prog?: number;
  time?: number;
}

export const cardsList: CardData[] = [
  {
    title: "Take the boss to the gun range",
    mgr: 5,
    money: -6,
  },
  {
    title: "Outsource work",
    money: -6,
    // prog: 3,
    mgr: -1,
  },
  {
    title: "Throw a party",
    // desc: "2x friend sentiment, -10 money",
    money: -10,
    fr: 5,
    // TODO: 2x friend sent
  },
  {
    title: "Say something 'smart' at the meeting",
    mgr: 2,
    fr: -3,
  },
  {
    title: "Have a baby",
    time: 9,
    mh: -3,
  },
  {
    title: "Ask a friend how to do it",
    // prog: 3,
    fr: -1,
  },
  {
    title: "Try to do the work",
    // prog: 1,
    mh: -1,
  },
  {
    title: "Apply for a promotion",
    mh: -3,
    mgr: 2,
  },
  {
    title: "Learn a few buzzwords",
    mgr: 1,
    // prog: 1,
    time: 1,
  },
];
