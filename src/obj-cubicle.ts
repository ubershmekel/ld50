import cubicleUrl from '../assets/cubicle.png';
import cubicleNormalMapUrl from '../assets/cubicle-nmap.png';
import { tweenPromise } from './utils';

const imageKey = 'cubicle';

export class CubicleObj extends Phaser.GameObjects.Sprite {
  constructor(scene: Phaser.Scene) {
    super(scene, 700, 200, imageKey);
  }

  static preload(scene: Phaser.Scene) {
    console.log('preload', this);
    scene.load.image({
      key: imageKey,
      url: cubicleUrl,
      normalMap: cubicleNormalMapUrl,
    });
  }

  create() {
    this.scene.add.existing(this);

    // Earlier, I was constructing this image in the `scene.preload`
    // But that caused the cubicle to look like a green debug box.
    // I used setTexture to fix this. But it still looked like a green
    // box for a bit unless I refactored `preload` to run as a static method.
    // this.setTexture(imageKey);

    this.pulse();

    this.setDepth(2);

    // Lights cause the wrong textures to show up when I use setDepth
    // and I don't see a workaround. Disabling for now.
    // this.sprite.setPipeline('Light2D');
    // this.sprite.setPipeline('SinglePipeline');
    // const light = this.scene.lights.addLight(0, 0, 200);
    // this.scene.lights.enable().setAmbientColor(0x999999);
    // this.scene.input.on('pointermove', function (pointer: Phaser.Input.Pointer) {
    //   light.x = pointer.x;
    //   light.y = pointer.y;
    // });

  }

  async pulse() {
    await tweenPromise(this.scene, {
      targets: this,
      scale: 1.5,
      duration: 300,
    });
    await tweenPromise(this.scene, {
      targets: this,
      scale: 1.0,
      duration: 300,
    });
    await tweenPromise(this.scene, {
      targets: this,
      scale: 1.5,
      duration: 500,
    });
    await tweenPromise(this.scene, {
      targets: this,
      scale: 1.0,
      duration: 100,
    });
  }
}