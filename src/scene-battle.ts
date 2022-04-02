import 'phaser';
import { CardObj } from './obj-card';
import { CubicleObj } from './obj-cubicle';
import { cardsList } from './card-data';
import { sampleSome } from './utils';

export class SceneBattle extends Phaser.Scene {
  cards: CardObj[] = [];
  cubicle!: CubicleObj;

  constructor() {
    super({
      key: 'SceneBattle'
    });
  }

  preload(): void {
    const randomCards = sampleSome(cardsList, 4);
    randomCards.map((cardData, index) => {
      const homePoint = new Phaser.Math.Vector2(300 + index * 180, 580);
      const draggableCardObj = new CardObj(this, cardData, homePoint);
      this.cards.push(draggableCardObj);
      draggableCardObj;
    });
    this.cards.map((card) => card.preload());

    this.cubicle = new CubicleObj();
    this.cubicle.preload(this);
  }

  create(): void {

    this.cards.map((card) => card.create());
    this.add.text(0, 0, 'Project Progress', {
      fontSize: '40px',
      fontFamily: "Helvetica",
    });

    this.cubicle.create(this);

    // this.physics.add.overlap(this.cubicle, healthGroup, spriteHitHealth);

    this.input.on('dragend', (_pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Sprite) => {
      console.log("dragend", gameObject);
      // gameObject.scale = 1.0;
      (gameObject as any as CardObj).tweenHome();
    });
  }

  update(): void {
  }
}