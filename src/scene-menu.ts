import 'phaser';
import particleUrl from '../assets/paperclip.png';
import welcomeUrl from '../assets/welcome1.png';
import splashUrl from '../assets/splash-screen.png';
import { gameHeight, gameWidth } from './config';
import { ButtonObj } from './obj-button';
import { SceneBattleKey } from './scene-battle';

const splashKey = 'splash';
const welcomeKey = 'welcome';
const paperClipKey = 'paperclip';

export class SceneMenu extends Phaser.Scene {
  private startKey!: Phaser.Input.Keyboard.Key;
  private sprites: { s: Phaser.GameObjects.Image, r: number; }[] = [];

  constructor() {
    super({
      key: 'SceneMenu'
    });
  }

  preload(): void {
    this.startKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.S,
    );
    this.startKey.isDown = false;
    this.load.image(paperClipKey, particleUrl);
    this.load.image(splashKey, splashUrl);
    this.load.image(welcomeKey, welcomeUrl);
  }

  create(): void {
    const welcomeImage = this.add.image(0, 0, welcomeKey).setOrigin(0);
    const splashImage = this.add.image(0, 0, splashKey).setOrigin(0);
    splashImage.alpha = 0;
    welcomeImage.setInteractive();

    const startButton = new ButtonObj(this, {
      width: gameWidth * 0.12,
      height: gameHeight * 0.1,
      text: "Start",
      outlinePx: 4,
      outlineColor: 0x073497,
      pointerDownColor: 0x343434,
      pointerUpColor: 0x147474,
      pointerOverColor: 0x545434,
      pointerOutColor: 0x545454,
    });

    startButton.alpha = 0;
    startButton.x = gameWidth * 0.5 - startButton.info.width / 2;
    startButton.y = gameHeight * 0.7;
    startButton.onPress = () => {
      this.scene.start(SceneBattleKey);
    };

    welcomeImage.on('pointerup', () => {
      splashImage.alpha = 1;
      welcomeImage.alpha = 0;
      startButton.alpha = 1;
    });


    // this.add.text(0, 0, 'Press S to restart scene', {
    //   fontSize: '60px',
    //   fontFamily: "Helvetica",
    // });

    // this.add.image(100, 100, 'particle');

    const paperClipsCount = 20;
    for (let i = 0; i < paperClipsCount; i++) {
      const x = Phaser.Math.Between(-gameWidth * 0.1, gameWidth * 1.1);
      const y = Phaser.Math.Between(-gameHeight * 0.1, gameHeight * 1.1);

      const image = this.add.image(x, y, paperClipKey);
      image.setBlendMode(Phaser.BlendModes.ADD);
      image.angle = Phaser.Math.Between(-180, 180);
      this.sprites.push({ s: image, r: 2 + Math.random() * 6 });
    }
  }

  update(): void {
    if (this.startKey.isDown) {
      this.sound.play('gasp');
      this.scene.start(this);
    }

    for (let i = 0; i < this.sprites.length; i++) {
      const sprite = this.sprites[i].s;

      sprite.y += this.sprites[i].r;

      if (sprite.y > gameHeight * 1.1) {
        sprite.y = -gameHeight * 0.1;
        sprite.x = Phaser.Math.Between(-gameWidth * 0.1, gameWidth * 1.1);
      }
    }

  }
}