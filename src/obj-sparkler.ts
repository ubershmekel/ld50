import clipsUrl from '../assets/grey-ball.png';

const key = 'clipsicles';

export class SparklerObj extends Phaser.GameObjects.Particles.ParticleEmitterManager {
  emitter: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor(scene: Phaser.Scene) {
    super(scene, key);
    scene.add.existing(this);
    this.emitter = this.createEmitter({
      alpha: { start: 1, end: 0 },
      scale: { start: 0.5, end: 2.5 },
      tint: { start: 0xff945e, end: 0xff945e },
      speedX: { min: -100, max: 100 },
      speedY: { min: -100, max: 100 },
      accelerationY: 0,
      angle: { min: -85, max: -95 },
      rotate: { min: -180, max: 180 },
      lifespan: { min: 1000, max: 2100 },
      // tint: { min: 0x999999, max: 0xaaaaaa },
      blendMode: 'ADD',
      frequency: 100,
      // maxParticles: 10,
      x: { min: -50, max: 50 },
      y: { min: -50, max: 150 },
    });
    this.setDepth(12);
    this.emitter.stop();
  }

  static preload(scene: Phaser.Scene) {
    scene.load.image(key, clipsUrl);
  }


}