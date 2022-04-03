
export interface ButtonInfo {
  width: number;
  height: number;
  text: string;
  outlinePx: number;
  outlineColor: number;
  pointerOverColor: number;
  pointerDownColor: number;
  pointerUpColor: number;
  pointerOutColor: number;
}

export class ButtonObj extends Phaser.GameObjects.Container {
  info: ButtonInfo;
  textObj: Phaser.GameObjects.Text;
  graphics: Phaser.GameObjects.Graphics;
  rect: Phaser.GameObjects.Rectangle;
  bgColor: number;
  onPress = () => { };

  constructor(scene: Phaser.Scene, info: ButtonInfo) {
    super(scene);
    scene.add.existing(this);
    this.graphics = scene.add.graphics();
    this.info = info;

    this.bgColor = this.info.pointerOutColor;

    this.textObj = scene.make.text({
      x: this.info.width / 2,
      y: this.info.height / 2,
      text: this.info.text,
      style: {
        wordWrap: { width: this.info.width },
        fontSize: '26px',
        align: 'center',
        fontStyle: 'bold',
      },
    });
    this.textObj.setOrigin(0.5);

    this.rect = scene.add.rectangle();
    this.rect.setOrigin(0, 0);
    this.rect.setScrollFactor(0);
    this.rect.setInteractive();
    // Buttons should be in front of most things, z-index, layer
    this.rect.depth = 11;

    this.add(this.graphics);
    this.add(this.textObj);
    this.add(this.rect);
    this.setScrollFactor(0);

    // this.setSize(this.info.width, this.info.height);
    // this.setInteractive();
    this.rect.setInteractive();
    this.rect.on('pointerover', () => {
      console.log('pointerover');
      this.bgColor = this.info.pointerOverColor;
      this.alpha = 1.0;
      this.draw();
    });

    this.rect.on('pointerup', () => {
      console.log('pointerup');
      this.bgColor = this.info.pointerUpColor;
      this.alpha = 1.0;
      this.draw();
      this.onPress();
    });

    this.rect.on('pointerout', () => {
      console.log('pointerout');
      this.bgColor = this.info.pointerOutColor;
      this.alpha = 1.0;
      this.draw();
    });

    this.rect.on('pointerdown', () => {
      console.log('pointerdown');
      this.alpha = 0.7;
      this.bgColor = this.info.pointerDownColor;
      this.draw();
    });
    // button.onInputOver.add(over, this);
    // button.onInputOut.add(out, this);
    // button.onInputUp.add(up, this);

    this.draw();
  }

  draw = () => {
    this.graphics.clear();

    // interactive hit box
    this.rect.displayHeight = this.info.height;
    this.rect.displayWidth = this.info.width;

    //  Outline
    this.graphics.fillStyle(this.info.outlineColor);
    this.graphics.fillRect(0, 0, this.info.width, this.info.height);

    //  Background
    this.graphics.fillStyle(this.bgColor);
    this.graphics.fillRect(this.info.outlinePx,
      this.info.outlinePx,
      this.info.width - 2 * this.info.outlinePx,
      this.info.height - 2 * this.info.outlinePx);

    // this.fillStyle(this.info.fillColor);
    // let fillWidth = this.info.width - 2 * this.info.outlinePx;
    // let fillHeight = this.info.height - 2 * this.info.outlinePx;
    // this.fillRect(this.info.outlinePx, this.info.outlinePx, fillWidth, fillHeight);
  };

  setValue = (text: string) => {
    // this.info.value = value;
    this.textObj.setText(text);
    this.draw();
  };

}
