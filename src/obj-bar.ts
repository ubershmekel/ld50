import mentalHealthUrl from '../assets/mental-health.png';
import friendsUrl from '../assets/friends.png';
import managerUrl from '../assets/manager.png';
import moneyUrl from '../assets/money.png';
import timeUrl from '../assets/time.png';
import { resourceKeys, ResourceKeysType } from './card-data';

export interface BarInfo {
  width: number;
  height: number;
  value: number;
  valueMax: number;
  outlinePx: number;
  outlineColor: number;
  backgroundColor: number;
  fillColor: number;
  isVertical: boolean;
}

export class BarObj extends Phaser.GameObjects.Graphics {
  info: BarInfo;

  constructor(scene: Phaser.Scene, info: BarInfo) {
    super(scene);
    scene.add.existing(this);
    this.info = info;
    this.draw();
  }

  static preload(scene: Phaser.Scene) {
    const resourceToUrl = {
      mh: mentalHealthUrl,
      mgr: managerUrl,
      fr: friendsUrl,
      money: moneyUrl,
      time: timeUrl,
    };
    for (const resKey of resourceKeys) {
      const imageKey = this.iconImageKey(resKey);
      const url = resourceToUrl[resKey];
      scene.load.image(imageKey, url);
    }
  }

  static iconImageKey(resourceKey: ResourceKeysType) {
    return 'icon-' + resourceKey;
  }

  // create() {
  //   // this.rect = scene.add.rectangle(gameWidth * 0.0, gameHeight * 0.0, gameWidth * 0.03, gameHeight);
  //   // this.rect.setOrigin(0, 0);
  //   // this.rect.setFillStyle(0x5555ee);
  //   // this.rect.depth = 9;
  // }

  draw = () => {
    this.clear();

    //  Outline
    this.fillStyle(this.info.outlineColor);
    this.fillRect(0, 0, this.info.width, this.info.height);

    //  Background
    this.fillStyle(this.info.backgroundColor);
    this.fillRect(this.info.outlinePx,
      this.info.outlinePx,
      this.info.width - 2 * this.info.outlinePx,
      this.info.height - 2 * this.info.outlinePx);

    // Filled part
    // if (this.value < 0.4) {
    //   this.fillStyle(0xff0000);
    // }
    // else {
    //   this.fillStyle(0x00ff00);
    // }

    this.fillStyle(this.info.fillColor);
    let fillWidth = this.info.width - 2 * this.info.outlinePx;
    let fillHeight = this.info.height - 2 * this.info.outlinePx;

    const pcent = this.info.value / this.info.valueMax;
    if (this.info.isVertical) {
      fillHeight = pcent * fillHeight;
      this.fillRect(this.info.outlinePx, this.info.height - this.info.outlinePx, fillWidth, -fillHeight);
    } else {
      fillWidth = pcent * fillWidth;
      this.fillRect(this.info.outlinePx, this.info.outlinePx, fillWidth, fillHeight);
    }
  };

  setValue = (value: number) => {
    this.info.value = value;
    if (this.info.value > this.info.valueMax) {
      this.info.value = this.info.valueMax;
    }
    if (this.info.value < 0) {
      this.info.value = 0;
    }
    this.draw();
  };

  getValue = () => {
    return this.info.value;
  };

}
