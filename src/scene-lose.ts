import 'phaser';
import gaspUrl from '../assets/gasp.mp3';
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
    this.load.audio('gasp', gaspUrl);
  }

  create(): void {
    this.add.text(gameWidth * 0.01, gameHeight * 0.01, `You were fired after ${this.props.score} weeks`, {
      fontSize: '60px',
      fontFamily: "Helvetica",
      color: '#ffffff',
    });

    this.add.text(gameWidth * 0.01, gameHeight / 2, `You ran out of ${codeToResourceName(this.props.reason as ResourceKeysType)}`, {
      fontSize: '60px',
      fontFamily: "Helvetica",
      color: '#ffffff',
    });

    this.sound.play('gasp');

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