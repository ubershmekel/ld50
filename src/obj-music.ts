import pianoBg2Url from '../assets/piano-background.mp3';
import pianoBgUrl from '../assets/piano-background-slow.mp3';
import voicesUrl from '../assets/voices-normalized.mp3';
import { sampleOne } from './utils';


const key1 = 'piano-bg';
const key2 = 'piano-bg2';
const cardSoundsKey = 'card-sounds';

let isGlobalMusicCreated = false;

const soundMarkersTimes = {
  'woohoo': { start: 1.26, duration: 2.218 },
  'mmyeah': { start: 5.107, duration: 3.466 },
  'googoo': { start: 9.813, duration: 3.876 },
  'how': { start: 16.596, duration: 1.231 },
  'blabla': { start: 19.6, duration: 1.24 },
  'yawn': { start: 22.489, duration: 2.348 },
  'netflix1': { start: 26.505, duration: 1.292 },
  'netflix2': { start: 28.679, duration: 1.755 },
  'netflix3': { start: 30.617, duration: 1.877 },
  'shoot': { start: 34.345, duration: 2.331 },
  'congrats': { start: 38.038, duration: 3.344 },
  'aww1': { start: 43.189, duration: 1.781 },
  'aww2': { start: 45.948, duration: 2.497 },
  'aww3': { start: 49.361, duration: 1.86 },
};

function keyToSoundMarker(key: keyof typeof soundMarkersTimes) {
  return {
    name: key,
    ...soundMarkersTimes[key],
  };
}


export class MusicObj extends Phaser.Sound.BaseSound {
  scene: Phaser.Scene;
  constructor(scene: Phaser.Scene) {
    super(scene.sound, key1);
    this.scene = scene;
  }

  static preload(scene: Phaser.Scene) {
    scene.load.audio(key1, pianoBgUrl);
    scene.load.audio(key2, pianoBg2Url);
    scene.load.audio(cardSoundsKey, voicesUrl);
  }

  create() {
    if (isGlobalMusicCreated) {
      return;
    } else {
      isGlobalMusicCreated = true;
    }

    this.playMarkerKey('congrats');

    const music1 = this.scene.sound.add(key1, {
      volume: 0.3,
    });
    const music2 = this.scene.sound.add(key2, {
      volume: 0.3,
    });

    music1.play();

    music1.on('complete', () => {
      music2.play();
    });

    music2.on('complete', () => {
      music1.play();
    });
  }

  playMarkerKey(key: keyof typeof soundMarkersTimes) {
    const marker = keyToSoundMarker(key);
    (marker as any).config = { volume: 0.5 };
    this.scene.sound.play(cardSoundsKey, marker);
  }

  playOneOf(keys: (keyof typeof soundMarkersTimes)[]) {
    const key = sampleOne(keys);
    this.playMarkerKey(key);
  }

  playEndGame() {
    this.playOneOf(['aww1', 'aww2', 'aww3']);
  }

  playCardSound(id: string) {

    // 'woohoo': { start: 1.26, duration: 2.218 },
    // 'mmyeah': { start: 5.107, duration: 3.466 },
    // 'googoo': { start: 9.813, duration: 3.876 },
    // 'how': { start: 16.596, duration: 1.231 },
    // 'blabla': { start: 19.6, duration: 1.24 },
    // 'yawn': { start: 22.489, duration: 2.348 },
    // 'netflix1': { start: 26.505, duration: 1.292 },
    // 'netflix2': { start: 28.679, duration: 1.755 },
    // 'netflix3': { start: 30.617, duration: 1.877 },
    // 'shoot': { start: 34.345, duration: 2.331 },
    // 'congrats': { start: 38.038, duration: 3.344 },
    // 'aww1': { start: 43.189, duration: 1.781 },
    // 'aww2': { start: 45.948, duration: 2.497 },
    // 'aww3': { start: 49.361, duration: 1.86 },
    const idToMarker: {
      [id: string]: (keyof typeof soundMarkersTimes)[];
    } = {
      party: ['woohoo'],
      saysmart: ['mmyeah'],
      baby: ['googoo'],
      askfriend: ['how'],
      trywork: ['yawn'],
      buzzwords: ['blabla'],
      tv: ['netflix1', 'netflix2', 'netflix3'],
    };

    const markerKeys = idToMarker[id as keyof typeof idToMarker];
    if (!markerKeys) {
      // throw new Error(`Card id has no sound: ${id}`);
      console.log(`Card id has no sound: ${id}`);
      return;
    }
    this.playOneOf(markerKeys);
  }
}