import 'phaser';
import { CardObj } from './obj-card';
import { CubicleObj } from './obj-cubicle';
import { cardsList } from './card-data';
import { sampleSome, tweenPromise } from './utils';
import { gameHeight, gameWidth } from './config';
import { BarObj } from './obj-bar';
import { MusicObj } from './obj-music';

export class SceneBattle extends Phaser.Scene {
  music!: MusicObj;

  cards: CardObj[] = [];
  cubicle!: CubicleObj;
  activeCard?: CardObj = undefined;

  mentalHealthBar!: BarObj;
  managerBar!: BarObj;
  friendBar!: BarObj;
  moneyBar!: BarObj;

  constructor() {
    super({
      key: 'SceneBattle'
    });
  }

  preload(): void {
    this.music = new MusicObj(this);
    this.music.preload();

    const randomCards = sampleSome(cardsList, 4);
    randomCards.map((cardData, index) => {
      const homePoint = new Phaser.Math.Vector2(300 + index * 180, 580);
      const draggableCardObj = new CardObj(this, cardData, homePoint, this.onDragCard);
      this.cards.push(draggableCardObj);
      draggableCardObj;
    });
    this.cards.map((card) => card.preload());

    CubicleObj.preload(this);

    this.mentalHealthBar = new BarObj(this, {
      width: gameWidth * 0.04,
      height: gameHeight * 0.4,
      value: 3,
      valueMax: 20,
      outlinePx: 4,
      outlineColor: 0x0774e7,
      backgroundColor: 0x111111,
      fillColor: 0xaaaa22,
      isVertical: true,
    });

    this.mentalHealthBar.x = gameWidth * 0.8;
    this.mentalHealthBar.y = 100;

    this.moneyBar = new BarObj(this, {
      width: gameWidth * 0.04,
      height: gameHeight * 0.4,
      value: 15,
      valueMax: 20,
      outlinePx: 4,
      outlineColor: 0x0774e7,
      backgroundColor: 0x111111,
      fillColor: 0x31a952,
      isVertical: true,
    });

    this.moneyBar.x = gameWidth * 0.85;
    this.moneyBar.y = 100;
  };

  create(): void {
    this.music.create();

    const cardsGroup = this.physics.add.group();

    this.cards.map((card) => {
      card.create();
      cardsGroup.add(card);
    });
    this.add.text(0, 0, 'Project Progress', {
      fontSize: '40px',
      fontFamily: "Helvetica",
    });

    this.cubicle = new CubicleObj(this);
    this.cubicle.x = gameWidth * 0.3;
    this.cubicle.create();

    // const physicsCubicle = this.physics.add.existing(this.cubicle);
    // this.physics.add.overlap(physicsCubicle, cardsGroup, () => {
    //   // console.log("overlap");
    //   this.cubicle.setTint(0xeeeeee);
    // });

    this.input.on('dragend', (_pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Sprite) => {
      // console.log("dragend", gameObject);
      // gameObject.scale = 1.0;
      this.cubicle.setTint(0x888888);
      if (this.activeCard) {
        this.activateCard();
      } else {
        (gameObject as any as CardObj).tweenHome();
      }
    });

    this.cubicle.setTint(0x888888);
  };

  async activateCard() {
    if (!this.activeCard) {
      throw new Error("Activated a card when no card was active");
    }
    this.activeCard.setDepth(10);

    await tweenPromise(this, {
      targets: this.activeCard,
      x: gameWidth / 2,
      y: gameHeight / 2,
      scale: 1.0,
      angle: 360,
      duration: 500,
    });

    this.moneyBar.setValue(Math.random() * 15);
  }

  update(): void {
  }

  onDragCard = (card: CardObj) => {
    // `=>` to make sure `this` is what we defined here.
    // console.log('ondragcard', this.cubicle);
    if (checkOverlap(card as any as Phaser.GameObjects.Sprite, this.cubicle as any as Phaser.GameObjects.Sprite)) {
      this.cubicle.setTint(0xeeeeee);
      this.activeCard = card;
    } else {
      this.cubicle.setTint(0x888888);
      this.activeCard = undefined;
    }
  };

}

function checkOverlap(spriteA: Phaser.GameObjects.Sprite, spriteB: Phaser.GameObjects.Sprite) {
  // console.log('bounds', spriteA, spriteB);
  var boundsA = spriteA.getBounds();
  var boundsB = spriteB.getBounds();
  return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);
}


