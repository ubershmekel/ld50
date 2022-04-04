import 'phaser';
import { codeToResourceName, ResourceKeysType } from './card-data';
import { gameHeight, gameWidth } from './config';
import { ButtonObj } from './obj-button';
import { SceneBattleKey } from './scene-battle';

export interface SceneLoseProps {
  score: number,
  reason: string,
}

export const SceneLoseKey = 'SceneLose';

export class SceneLose extends Phaser.Scene {
  props!: SceneLoseProps;

  constructor() {
    super({
      key: SceneLoseKey,
    });
  }

  init(props: SceneLoseProps) {
    this.props = props;
  }

  preload(): void {
  }

  create(): void {
    this.add.text(gameWidth * 0.01, gameHeight * 0.01, `You were fired after ${this.props.score} weeks`, {
      fontSize: '60px',
      fontFamily: "Helvetica",
      color: '#ffffff',
    });

    const resourceKey = this.props.reason as ResourceKeysType;
    const resourceName = codeToResourceName(resourceKey).toLowerCase();
    const reasonText = `You ran out of ${resourceName}`;
    this.add.text(gameWidth * 0.01, gameHeight / 2, reasonText, {
      fontSize: '60px',
      fontFamily: "Helvetica",
      color: '#ffffff',
    });

    const keyToStory = {
      'mh': 'You had a mental breakdown, yelled at everyone, and punched the dog. How rude. Get out of here.',
      'mgr': 'Your manager has decided to fire you immediately.',
      'fr': "Your friends don't like you and have decided to talk to HR about it. You're out.",
      'money': "You failed to pay rent, came to work stinky, and that was the last straw.",
      'time': "Performance review time has arrived. What were you doing? You didn't code even a single line... Get out of here.",
    };

    const story = keyToStory[resourceKey];
    this.add.text(gameWidth * 0.01, gameHeight * 0.64, story, {
      fontSize: '20px',
      fontFamily: "Helvetica",
      color: '#ffffff',
      wordWrap: { width: gameWidth / 2 },
    });

    const devNote = `Thank you for playing the game! I (the game dev) was able to make it up to week 13. Please leave a comment mentioning how far you got.`;
    this.add.text(gameWidth * 0.01, gameHeight * 0.84, devNote, {
      fontSize: '16px',
      fontFamily: "Helvetica",
      color: '#ffffff',
      wordWrap: { width: gameWidth / 2 },
    });

    const tryAgainButton = new ButtonObj(this, {
      width: gameWidth * 0.12,
      height: gameHeight * 0.1,
      text: "Try again",
      outlinePx: 4,
      outlineColor: 0x073497,
      pointerDownColor: 0x343434,
      pointerUpColor: 0x147474,
      pointerOverColor: 0x545434,
      pointerOutColor: 0x545454,
    });

    tryAgainButton.x = gameWidth * 0.7;
    tryAgainButton.y = gameHeight * 0.7;
    tryAgainButton.onPress = () => {
      this.scene.start(SceneBattleKey);
    };
  }

  update(): void {

  }
}