import cubicleUrl from '../assets/cubicle.png';
import cubicleNormalMapUrl from '../assets/cubicle-nmap.png';
import { tweenPromise } from './utils';

const imageKey = 'cubicle';

export class CubicleObj {
  sprite!: Phaser.GameObjects.Image;

  preload(scene: Phaser.Scene) {
    scene.load.image({
      key: imageKey,
      url: cubicleUrl,
      normalMap: cubicleNormalMapUrl,
    });
  }

  create(scene: Phaser.Scene) {
    const image = scene.add.image(700, 200, imageKey);
    this.sprite = image;
    this.pulse(scene, image);

    this.sprite.setDepth(100);

    // Lights cause the wrong textures to show up when I use setDepth
    // and I don't see a workaround. Disabling for now.
    // this.sprite.setPipeline('Light2D');
    // this.sprite.setPipeline('SinglePipeline');
    // const light = scene.lights.addLight(0, 0, 200);
    // scene.lights.enable().setAmbientColor(0x999999);
    // scene.input.on('pointermove', function (pointer: Phaser.Input.Pointer) {
    //   light.x = pointer.x;
    //   light.y = pointer.y;
    // });

  }

  async pulse(scene: Phaser.Scene, image: Phaser.GameObjects.Image) {
    await tweenPromise(scene, {
      targets: image,
      scale: 1.5,
      duration: 300,
    });
    await tweenPromise(scene, {
      targets: image,
      scale: 1.0,
      duration: 300,
    });
    await tweenPromise(scene, {
      targets: image,
      scale: 1.5,
      duration: 500,
    });
    await tweenPromise(scene, {
      targets: image,
      scale: 1.0,
      duration: 100,
    });
  }
}