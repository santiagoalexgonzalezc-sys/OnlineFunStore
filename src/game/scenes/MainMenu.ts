import Phaser from 'phaser';

export default class MainMenu extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenu' });
  }

  create() {
    const { width, height } = this.cameras.main;

    // Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e);

    // Title
    this.add.text(width / 2, height / 3, 'Store Management Simulator', {
      fontSize: '48px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(width / 2, height / 2, 'Build your retail empire from scratch', {
      fontSize: '24px',
      color: '#a0a0a0',
    }).setOrigin(0.5);

    // Start button placeholder
    const startButton = this.add.rectangle(width / 2, height * 0.7, 200, 50, 0x4a9eff);
    this.add.text(width / 2, height * 0.7, 'Start Game', {
      fontSize: '20px',
      color: '#ffffff',
    }).setOrigin(0.5);

    startButton.setInteractive({ useHandCursor: true });
    startButton.on('pointerover', () => startButton.setFillStyle(0x3a8eef));
    startButton.on('pointerout', () => startButton.setFillStyle(0x4a9eff));
    startButton.on('pointerdown', () => {
      this.scene.start('StoreView');
    });
  }
}