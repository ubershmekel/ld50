import 'phaser';
import { CardObj } from './obj-card';
import { CubicleObj } from './obj-cubicle';
import { cardsList } from './card-data';
import { sampleSome, tweenPromise } from './utils';
import { gameHeight, gameWidth } from './config';

export class SceneBattle extends Phaser.Scene {
  cards: CardObj[] = [];
  cubicle!: CubicleObj;
  activeCard?: CardObj = undefined;

  constructor() {
    super({
      key: 'SceneBattle'
    });
  }

  preload(): void {
    const randomCards = sampleSome(cardsList, 4);
    randomCards.map((cardData, index) => {
      const homePoint = new Phaser.Math.Vector2(300 + index * 180, 580);
      const draggableCardObj = new CardObj(this, cardData, homePoint, this.onDragCard);
      this.cards.push(draggableCardObj);
      draggableCardObj;
    });
    this.cards.map((card) => card.preload());

    this.cubicle = new CubicleObj(this);
    this.cubicle.preload();
  };

  create(): void {
    const cardsGroup = this.physics.add.group();

    this.cards.map((card) => {
      card.create();
      cardsGroup.add(card);
    });
    this.add.text(0, 0, 'Project Progress', {
      fontSize: '40px',
      fontFamily: "Helvetica",
    });

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

  activateCard() {
    if (!this.activeCard) {
      throw new Error("Activated a card when no card was active");
    }
    this.activeCard.setDepth(10);
    tweenPromise(this, {
      targets: this.activeCard,
      x: gameWidth / 2,
      y: gameHeight / 2,
      scale: 1.0,
      duration: 500,
    });
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
  console.log('bounds', spriteA, spriteB);
  var boundsA = spriteA.getBounds();
  var boundsB = spriteB.getBounds();
  return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);
}


