import 'phaser';
import { CardObj } from './obj-card';
import { CubicleObj } from './obj-cubicle';
import { CardData, cardsList, codeToColor, resourceKeys } from './card-data';
import { sampleSome, tweenPromise } from './utils';
import { gameHeight, gameWidth } from './config';
import { BarObj } from './obj-bar';
import { MusicObj } from './obj-music';
import { ButtonObj } from './obj-button';
import { SparklerObj } from './obj-sparkler';
import { SceneLoseKey, SceneLoseProps } from './scene-lose';
import { isInFullScreen, requestFullScreen } from './full-screener';

export const SceneBattleKey = 'SceneBattle';

export class SceneBattle extends Phaser.Scene {
  turnsAlive = 0;
  cardsUsedThisTurn = 0;

  music!: MusicObj;
  topText!: Phaser.GameObjects.Text;

  cards: CardObj[] = [];
  cubicle!: CubicleObj;
  activeCard?: CardObj = undefined;

  mentalHealthBar!: BarObj;
  managerBar!: BarObj;
  friendBar!: BarObj;
  moneyBar!: BarObj;
  timeBar!: BarObj;

  endTurnButton!: ButtonObj;

  sparkler!: SparklerObj;
  keyToBar = {
    mh: this.mentalHealthBar,
    mgr: this.managerBar,
    fr: this.friendBar,
    money: this.moneyBar,
    time: this.timeBar,
  };

  constructor() {
    super({
      key: SceneBattleKey,
    });
  }

  preload(): void {
    this.music = new MusicObj(this);
    this.music.preload();

    CardObj.preload(this);

    CubicleObj.preload(this);

    SparklerObj.preload(this);

    BarObj.preload(this);

    this.endTurnButton = new ButtonObj(this, {
      width: gameWidth * 0.12,
      height: gameHeight * 0.1,
      text: "End turn",
      outlinePx: 4,
      outlineColor: 0x073497,
      pointerDownColor: 0x343434,
      pointerUpColor: 0x147474,
      pointerOverColor: 0x545434,
      pointerOutColor: 0x545454,
    });

    this.endTurnButton.x = gameWidth * 0.8;
    this.endTurnButton.y = gameHeight * 0.8;
    this.endTurnButton.onPress = () => {
      this.endTurn();
    };
  };

  endTurn() {
    if (this.cardsUsedThisTurn === 0) {
      this.mentalHealthBar.setValue(this.mentalHealthBar.getValue() - 2);
    }

    this.dealFromDeck();
    const timeLeft = this.timeBar.getValue() - 1;
    this.timeBar.setValue(timeLeft);
    this.moneyBar.setValue(this.moneyBar.getValue() + 1);
    this.checkWhetherToEndBattle();

    this.turnsAlive += 1;
    this.topText.text = ("Week: " + this.turnsAlive);
  }

  dealFromDeck() {
    this.cardsUsedThisTurn = 0;
    this.cards.map((card) => {
      card.destroy();
    });
    this.cards = [];
    const randomCards = sampleSome(cardsList, 4);
    randomCards.map((cardData, index) => {
      const homePoint = new Phaser.Math.Vector2(300 + index * 180, 580);
      const draggableCardObj = new CardObj(this, cardData, homePoint, this.onDragCard);
      draggableCardObj.y = gameHeight;
      this.cards.push(draggableCardObj);
      draggableCardObj.create();
    });

  }

  create(): void {
    this.createBars();

    this.input.on('pointerdown', () => {
      if (!isInFullScreen()) {
        requestFullScreen(document.getElementById("app"));
        // this.game.scale.startFullscreen();
      }
    });

    this.turnsAlive = 0;
    this.music.create();

    this.dealFromDeck();

    this.topText = this.add.text(gameWidth * 0.01, gameHeight * 0.01, "I don't know how to code, week 0", {
      fontSize: '40px',
      fontFamily: "Helvetica",
    });

    this.cubicle = new CubicleObj(this);
    this.cubicle.x = gameWidth * 0.3;
    this.cubicle.create();

    this.sparkler = new SparklerObj(this);

    this.input.on('dragend', (_pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Sprite) => {
      // console.log("dragend", gameObject);
      // gameObject.scale = 1.0;
      // this.cubicle.setTint(0x888888);
      this.sparkler.emitter.stop();
      if (this.activeCard) {
        this.activateCard();
      } else {
        (gameObject as any as CardObj).tweenHome();
      }
    });

    // this.cubicle.setTint(0x888888);
  };

  async activateCard() {
    if (!this.activeCard) {
      throw new Error("Activated a card when no card was active");
    }
    this.activeCard.setDepth(10);
    this.cardsUsedThisTurn += 1;

    // this.moneyBar.setValue(Math.random() * 15);
    for (const key of resourceKeys) {
      const valueChange = this.activeCard.card[key as keyof CardData] as number | undefined;
      if (!valueChange) {
        continue;
      }
      const bar = this.keyToBar[key];
      bar.setValue(bar.getValue() + valueChange);
    }

    this.checkWhetherToEndBattle();

    if (this.cardsUsedThisTurn === this.cards.length) {
      this.endTurnButton.pulse();
    }

    await tweenPromise(this, {
      targets: this.activeCard,
      x: gameWidth / 2,
      y: gameHeight / 2,
      scale: 1.0,
      angle: 360 - 720 * Math.random(),
      duration: 500,
      alpha: 0,
    });

  }

  checkWhetherToEndBattle() {
    for (const key of resourceKeys) {
      const bar = this.keyToBar[key as keyof typeof this.keyToBar];

      if (bar.getValue() <= 0) {
        this.endBattle(key);
      }
    }
  }

  endBattle(resourceKey: string) {
    console.log("endbattle");
    const sceneProps: SceneLoseProps = {
      reason: resourceKey,
      score: this.turnsAlive,
    };
    this.scene.start(SceneLoseKey, sceneProps);
  }

  onDragCard = (card: CardObj) => {
    // `=>` to make sure `this` is what we defined here.
    // console.log('ondragcard', this.cubicle);
    if (checkOverlap(card as any as Phaser.GameObjects.Sprite, this.cubicle as any as Phaser.GameObjects.Sprite)) {
      // this.cubicle.setTint(0xeeeeee);
      this.activeCard = card;
      this.sparkler.emitter.start();
      this.sparkler.x = this.input.activePointer.x;
      this.sparkler.y = this.input.activePointer.y;
    } else {
      // this.cubicle.setTint(0x888888);
      this.activeCard = undefined;
      this.sparkler.emitter.stop();
    }
  };

  createBars() {
    const defaultBarValue = 10;

    this.mentalHealthBar = new BarObj(this, {
      width: gameWidth * 0.04,
      height: gameHeight * 0.4,
      value: defaultBarValue,
      valueMax: 20,
      outlinePx: 4,
      outlineColor: 0x0774e7,
      backgroundColor: 0x111111,
      fillColor: codeToColor.mh,
      isVertical: true,
    });

    this.moneyBar = new BarObj(this, {
      width: gameWidth * 0.04,
      height: gameHeight * 0.4,
      value: defaultBarValue,
      valueMax: 20,
      outlinePx: 4,
      outlineColor: 0x0774e7,
      backgroundColor: 0x111111,
      fillColor: codeToColor.money,
      isVertical: true,
    });

    this.friendBar = new BarObj(this, {
      width: gameWidth * 0.04,
      height: gameHeight * 0.4,
      value: defaultBarValue,
      valueMax: 20,
      outlinePx: 4,
      outlineColor: 0x0774e7,
      backgroundColor: 0x111111,
      fillColor: codeToColor.fr,
      isVertical: true,
    });

    this.managerBar = new BarObj(this, {
      width: gameWidth * 0.04,
      height: gameHeight * 0.4,
      value: defaultBarValue,
      valueMax: 20,
      outlinePx: 4,
      outlineColor: 0x0774e7,
      backgroundColor: 0x111111,
      fillColor: codeToColor.mgr,
      isVertical: true,
    });

    this.timeBar = new BarObj(this, {
      width: gameWidth * 0.04,
      height: gameHeight * 0.4,
      value: defaultBarValue,
      valueMax: 20,
      outlinePx: 4,
      outlineColor: 0x0774e7,
      backgroundColor: 0x111111,
      fillColor: codeToColor.time,
      isVertical: true,
    });

    this.keyToBar = {
      mh: this.mentalHealthBar,
      mgr: this.managerBar,
      fr: this.friendBar,
      money: this.moneyBar,
      time: this.timeBar,
    };

    const bars = [
      this.mentalHealthBar,
      this.friendBar,
      this.managerBar,
      this.moneyBar,
      this.timeBar,
    ];

    for (let i = 0; i < bars.length; i++) {
      bars[i].x = gameWidth * (0.7 + i * 0.05);
      bars[i].y = 100;
    }

    for (const resKey of resourceKeys) {
      const bar = this.keyToBar[resKey];
      const image = this.add.image(bar.x - 5, bar.y - 70, BarObj.iconImageKey(resKey));
      image.setOrigin(0);
      image.setScale(0.8);
    }
  }
}

function checkOverlap(spriteA: Phaser.GameObjects.Sprite, spriteB: Phaser.GameObjects.Sprite) {
  // console.log('bounds', spriteA, spriteB);
  var boundsA = spriteA.getBounds();
  var boundsB = spriteB.getBounds();
  return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);
}


