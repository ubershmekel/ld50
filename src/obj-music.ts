import pianoBg2Url from '../assets/piano-background.mp3';
import pianoBgUrl from '../assets/piano-background-slow.mp3';


const key1 = 'piano-bg';
const key2 = 'piano-bg2';

let isGlobalMusicCreated = false;

export class MusicObj extends Phaser.Sound.BaseSound {
  scene: Phaser.Scene;
  constructor(scene: Phaser.Scene) {
    super(scene.sound, key1);
    this.scene = scene;
  }

  static preload(scene: Phaser.Scene) {
    scene.load.audio(key1, pianoBgUrl);
    scene.load.audio(key2, pianoBg2Url);
  }

  create() {
    if (isGlobalMusicCreated) {
      return;
    } else {
      isGlobalMusicCreated = true;
    }

    const music1 = this.scene.sound.add(key1, {
      volume: 0.5,
    });
    const music2 = this.scene.sound.add(key2, {
      volume: 0.5,
    });

    music1.play();

    music1.on('complete', () => {
      music2.play();
    });

    music2.on('complete', () => {
      music1.play();
    });
  }
}