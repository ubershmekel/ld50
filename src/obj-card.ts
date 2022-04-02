import gunRangeUrl from '../assets/gun-range.png';
import cardbackUrl from '../assets/cardback.png';
import type { CardData } from './card-data';
import { tweenPromise } from './utils';

const imageKey = 'card-back';

export class CardObj extends Phaser.GameObjects.Container {
  card: CardData;
  homePoint: Phaser.Math.Vector2;

  constructor(scene: Phaser.Scene, card: CardData, homePoint: Phaser.Math.Vector2) {
    super(scene);
    this.card = card;
    this.homePoint = homePoint;
    scene.add.existing(this);
  }

  preload() {
    this.scene.load.image('card-object', gunRangeUrl);
    this.scene.load.image(imageKey, cardbackUrl);
  }

  create() {
    const sprite = this.scene.add.image(0, 0, imageKey);
    this.add(sprite);

    const title = this.scene.add.text(-sprite.width / 2, -110, this.card.title, {
      fontSize: '14px',
      fontFamily: "Helvetica",
      wordWrap: { width: sprite.width },
    });
    this.add(title);

    const effectString = effectTextFromCard(this.card);
    const effectsText = this.scene.add.text(-sprite.width / 2, 40, effectString, {
      fontSize: '14px',
      fontFamily: "Helvetica",
      wordWrap: { width: sprite.width },
      color: '#000',
    });
    this.add(effectsText);

    this.setSize(sprite.width, sprite.height);
    this.setInteractive();
    this.scene.input.setDraggable(this);
    // this.scene.input.on('drag', (_pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Sprite, dragX: number, dragY: number) => {
    this.on('drag', (_pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
      // if (gameObject !== this) {
      //   return;
      // }
      // gameObject.x = dragX;
      // gameObject.y = dragY;
      // gameObject.scale = 1.3;
      this.x = dragX;
      this.y = dragY;
      // console.log('drag', this.card.title);

      // UNCOMMENT THIS setDepth TO SEE A STRANGE TEXTURE ISSUE WHEN YOU DRAG CARDS
      // COMMENT IT OUT AND EVERYTHING SEEMS TO BE FINE.
      this.setDepth(1);

      tweenPromise(this.scene, {
        targets: this,
        scale: 1.3,
        duration: 40,
      });
    });

    this.tweenHome();

    // const zone = scene.add.zone(500, 300, 200, 200).setDropZone();
    // //  Just a visual display of the drop zone
    // var graphics = scene.add.graphics();
    // graphics.lineStyle(2, 0xffff00);
    // graphics.strokeRect(zone.x, zone.y, zone.width, zone.height);
    // graphics.strokeRect(zone.x + zone.input.hitArea.x, zone.y + zone.input.hitArea.y, zone.input.hitArea.width, zone.input.hitArea.height);


    // scene.input.on('drop', function (_pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Sprite, dropZone: Phaser.GameObjects.Zone) {
    //   console.log("drop");
    //   gameObject.x = dropZone.x;
    //   gameObject.y = dropZone.y;
    // });
  }


  tweenHome() {
    console.log("tweenhome", this, this.card.title);
    tweenPromise(this.scene, {
      targets: this,
      x: this.homePoint.x,
      y: this.homePoint.y,
      scale: 1.0,
      duration: 300,
    });
  };
}


function effectTextFromCard(card: CardData) {
  // const values = {
  //   mh?: number;
  //   mgr?: number;
  //   fr?: number;
  //   money?: number;
  //   prog?: number;
  //   time?: number;
  // }
  const parts = [];
  const valKeys = ['mh', 'mgr', 'fr', 'money', 'prog', 'time'];
  for (const key of valKeys) {
    const val = card[key as keyof CardData] as number;
    if (!val) {
      continue;
    }
    let valText = String(val);
    if (val > 0) {
      valText = '+' + valText;
    }
    const text = `${key} ${valText}`;
    parts.push(text);
  }
  return parts.join(', ');
}
