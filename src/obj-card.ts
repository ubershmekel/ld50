import BBCodeText from 'phaser3-rex-plugins/plugins/bbcodetext.js';
import gunRangeUrl from '../assets/gun-range.png';
import cardbackUrl from '../assets/cardback.png';
import { CardData, codeToColor, codeToResourceName, resourceKeys } from './card-data';
import { tweenPromise } from './utils';

const imageKey = 'card-back';

export class CardObj extends Phaser.GameObjects.Container {
  card: CardData;
  homePoint: Phaser.Math.Vector2;
  onDrag: Function;

  constructor(scene: Phaser.Scene, card: CardData, homePoint: Phaser.Math.Vector2, onDrag: Function) {
    super(scene);
    this.card = card;
    this.homePoint = homePoint;
    this.onDrag = onDrag;
    scene.add.existing(this);
  }

  static preload(scene: Phaser.Scene) {
    scene.load.image('card-object', gunRangeUrl);
    scene.load.image(imageKey, cardbackUrl);
  }

  create() {
    const paddingPx = 4;
    const sprite = this.scene.add.image(0, 0, imageKey);
    this.add(sprite);

    const title = this.scene.add.text(-sprite.width / 2 + paddingPx, -110, this.card.title, {
      fontSize: '14px',
      fontFamily: "Helvetica",
      wordWrap: { width: sprite.width - paddingPx },
    });
    this.add(title);

    const effectString = effectTextFromCard(this.card);
    // const effectsText = this.scene.add.text(-sprite.width / 2 + paddingPx, 40, effectString, {
    const effectsText = new BBCodeText(this.scene, -sprite.width / 2 + paddingPx, 40, effectString, {
      fontSize: '14px',
      fontFamily: "Helvetica",
      // wordWrap: { width: sprite.width - paddingPx },
      wrap: {
        mode: 'word',
        width: sprite.width - paddingPx,
      },
      color: '#ffffff',
    });
    this.add(effectsText);

    this.setSize(sprite.width, sprite.height);
    this.setDepth(-2);
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
      this.setDepth(2);

      tweenPromise(this.scene, {
        targets: this,
        scale: 1.3,
        duration: 40,
      });

      this.onDrag(this);
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
    // console.log("tweenhome", this, this.card.title);
    tweenPromise(this.scene, {
      targets: this,
      x: this.homePoint.x,
      y: this.homePoint.y,
      scale: 1.0,
      duration: 300,
    });
    this.setDepth(0);
  };
}


function effectTextFromCard(card: CardData) {
  const parts = [];
  for (const key of resourceKeys) {
    const val = card[key as keyof CardData] as number;
    if (!val) {
      continue;
    }
    let valText = String(val);
    if (val > 0) {
      valText = '+' + valText;
    }
    const color = codeToColor[key] as number;
    const text = `${codeToResourceName(key)} [color=#${color.toString(16)}]${valText}[/color]`;
    parts.push(text);
  }
  return parts.join(', ');
}
