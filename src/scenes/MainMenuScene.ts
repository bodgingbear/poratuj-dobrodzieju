import { TextButton } from 'packages/text-button';
import { centerElement } from 'packages/utils';
import { shouldOpenDayScene } from 'packages/utils/shouldSkipIntro';

export class MainMenuScene extends Phaser.Scene {
  public constructor() {
    super({
      key: 'MainMenuScene',
    });
  }

  public create(): void {
    // const vid = this.add.video(1280 / 2, 720 / 2, 'demo');
    // vid.play(true);
    // vid.setScale(0.9);
    // vid.setAlpha(0.75);

    const text = this.add.text(1280 / 2, 64, 'Poratuj Dobrodzieju!', {
      fontSize: '48px',
      fill: '#fff',
      align: 'center',
      lineSpacing: 10,
    });

    centerElement(text);

    const pressSpaceButton = this.add.text(
      1280 / 2,
      720 - 32 - 32,
      'Naciśnij SPACJĘ żeby zagrać',
      {
        fontSize: '24px',
        fill: '#fff',
        align: 'center',
        lineSpacing: 10,
      }
    );

    pressSpaceButton.setOrigin(0.5, 0.5);

    this.input.keyboard.addKey('SPACE').on('down', (): void => {
      this.scene.start(shouldOpenDayScene() ? 'DayScene' : 'GameScene');
    });

    const howToPlayButton = new TextButton(this, 32, 720 - 32, 'Jak Grać?', {
      originX: 0,
      originY: 1,
    });
    howToPlayButton.on('click', () => this.scene.start('HowToPlayScene'));

    const creditsButton = new TextButton(this, 1280 - 32, 720 - 32, 'Autorzy', {
      originX: 1,
      originY: 1,
    });
    creditsButton.on('click', () => this.scene.start('CreditsScene'));
  }
}
