/*
  * Mental health - mh
  * Manager sentiment - mgr
  * Friend sentiment - fr
  * Money - money
  * OKR Progress - prog
*/

export type ResourceKeysType = 'mh' | 'mgr' | 'fr' | 'money' | 'time';
export const resourceKeys: ResourceKeysType[] = ['mh', 'mgr', 'fr', 'money', 'time'];

export interface CardData {
  id: string,
  title: string;
  mh?: number;
  mgr?: number;
  fr?: number;
  money?: number;
  // prog?: number;
  time?: number;
}

export const codeToColor = {
  mh: 0xaaaa22,
  money: 0x31a952,
  fr: 0x3f86f4,
  mgr: 0xea4131,
  time: 0x747474,
};

export function codeToResourceName(code: ResourceKeysType) {
  const names: {
    [key in keyof Partial<CardData>]: string;
  } = {
    mh: "Mental health",
    mgr: "Manager sentiment",
    fr: "Friends sentiment",
    money: "Money",
    time: "Time to performance review",
  };

  return names[code];
}

export const cardsList: CardData[] = [
  {
    id: "gunrange",
    title: "Take the boss to the gun range",
    mgr: 5,
    money: -3,
  },
  {
    id: "outsource",
    title: "Outsource work",
    money: -3,
    mgr: -1,
    time: 1,
  },
  {
    id: "party",
    title: "Throw a party",
    money: -3,
    fr: 5,
    mh: 1,
  },
  {
    id: "saysmart",
    title: "Say something 'smart' at the meeting",
    mgr: 2,
    fr: -3,
  },
  {
    id: "baby",
    title: "Have a baby",
    time: 2,
    mh: -1,
    money: -5,
  },
  {
    id: "askfriend",
    title: "Ask a friend how to do it",
    fr: -2,
    mgr: 1,
  },
  {
    id: "trywork",
    title: "Try to do the work",
    mh: -1,
    fr: 1,
  },
  {
    id: "promo",
    title: "Apply for a promotion",
    mh: -3,
    mgr: 2,
  },
  {
    id: "buzzwords",
    title: "Learn a few buzzwords",
    mgr: 1,
    mh: -1,
  },
  {
    id: "docs",
    title: "Add documentation",
    fr: 1,
    mh: -1,
  },
  {
    id: "vacation",
    title: "Take a long vacation",
    money: -1,
    mgr: -3,
    mh: 3,
  },
  {
    id: "tv",
    title: 'Watch a "bit" of TV',
    mgr: -1,
    mh: 1,
  },
];
