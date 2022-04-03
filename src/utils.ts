// Random utility functions

export const globalDebug = false;

// https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
export function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

/**
* Returns a random integer between min (inclusive) and max (inclusive).
* The value is no lower than min (or the next integer greater than min
* if min isn't an integer) and no greater than max (or the next integer
* lower than max if max isn't an integer).
* Using Math.round() will give you a non-uniform distribution!
*/
export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function sleep(ms: number) {
  // https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function tweenPromise(scene: Phaser.Scene, config: Phaser.Types.Tweens.TweenBuilderConfig | object) {
  return new Promise(resolve => {
    // Type cast to avoid `onComplete` does not exist on `typeof object`
    (config as Phaser.Types.Tweens.TweenBuilderConfig).onComplete = resolve;
    scene.tweens.add(config);
  });
}

export function sampleOne<Type>(arr: Type[]): Type {
  // https://stackoverflow.com/questions/4550505/getting-a-random-value-from-a-javascript-array
  return arr[Math.floor(Math.random() * arr.length)];
}

export function sampleSome<Type>(arr: Type[], amount: number): Type[] {
  // https://stackoverflow.com/questions/3895478/does-javascript-have-a-method-like-range-to-generate-a-range-within-the-supp
  return [...Array(amount).keys()].map(() => sampleOne(arr));
}

