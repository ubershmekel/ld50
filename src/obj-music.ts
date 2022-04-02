// import pianoBgUrl from '../assets/piano-background.mp3';
const key = 'piano-bg';

export class MusicObj extends Phaser.Sound.BaseSound {
  scene: Phaser.Scene;
  constructor(scene: Phaser.Scene) {
    super(scene.sound, key);
    this.scene = scene;
  }

  preload() {
    // this.scene.load.audio(key, pianoBgUrl);
  }

  create() {
    // const music = this.scene.sound.add(key);
    // music.play();
  }
}