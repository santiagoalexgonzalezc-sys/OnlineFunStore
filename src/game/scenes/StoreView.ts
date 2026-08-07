import Phaser from 'phaser';

export default class StoreView extends Phaser.Scene {
  constructor() {
    super({ key: 'StoreView' });
  }

  create() {
    const { width, height } = this.cameras.main;

    // Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x2d2d44);

    // Store floor
    this.add.rectangle(width / 2, height / 2, width * 0.8, height * 0.7, 0x8b7355);

    // Store title (will be updated dynamically)
    this.storeTitle = this.add.text(width / 2, 30, 'Your Store', {
      fontSize: '32px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Time display
    this.timeText = this.add.text(width - 150, 30, 'Day 1, 08:00', {
      fontSize: '18px',
      color: '#a0a0a0',
    }).setOrigin(0.5);

    // Cash display
    this.cashText = this.add.text(150, 30, '$1,000.00', {
      fontSize: '20px',
      color: '#4ade80',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Back button
    const backButton = this.add.rectangle(80, 30, 100, 40, 0x4a9eff);
    this.add.text(80, 30, 'Back', {
      fontSize: '16px',
      color: '#ffffff',
    }).setOrigin(0.5);

    backButton.setInteractive({ useHandCursor: true });
    backButton.on('pointerover', () => backButton.setFillStyle(0x3a8eef));
    backButton.on('pointerout', () => backButton.setFillStyle(0x4a9eff));
    backButton.on('pointerdown', () => {
      this.scene.start('MainMenu');
    });

    // Add shelves (placeholder)
    this.createShelves(width, height);

    // Add customer placeholders
    this.createCustomers(width, height);

    // Management buttons
    this.createManagementButtons(width, height);

    // Make scene accessible for external updates
    this.registry.set('storeView', this);
  }

  // Method to update store info from outside
  updateStoreInfo(name: string, cash: number, day: number, hour: number, minute: number) {
    if (this.storeTitle) {
      this.storeTitle.setText(name);
    }
    if (this.cashText) {
      this.cashText.setText(`$${cash.toFixed(2)}`);
    }
    if (this.timeText) {
      this.timeText.setText(`Day ${day}, ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
    }
  }

  private createShelves(width: number, height: number): void {
    // Create some placeholder shelves
    const shelfPositions = [
      { x: width * 0.2, y: height * 0.4 },
      { x: width * 0.4, y: height * 0.4 },
      { x: width * 0.6, y: height * 0.4 },
      { x: width * 0.8, y: height * 0.4 },
      { x: width * 0.2, y: height * 0.6 },
      { x: width * 0.4, y: height * 0.6 },
      { x: width * 0.6, y: height * 0.6 },
      { x: width * 0.8, y: height * 0.6 },
    ];

    shelfPositions.forEach(pos => {
      // Shelf base
      this.add.rectangle(pos.x, pos.y, 120, 20, 0x5c4033);
      // Shelf back
      this.add.rectangle(pos.x, pos.y - 30, 120, 60, 0x6b4423);
      // Products placeholder
      this.add.rectangle(pos.x, pos.y - 20, 80, 10, 0xff6b6b);
    });
  }

  private createCustomers(width: number, height: number): void {
    // Create some placeholder customers
    for (let i = 0; i < 3; i++) {
      const x = width * 0.3 + (i * width * 0.2);
      const y = height * 0.8;
      
      // Customer body
      this.add.circle(x, y, 15, 0x64b5f6);
      // Customer head
      this.add.circle(x, y - 20, 10, 0xffcc80);
    }
  }

  private createManagementButtons(width: number, height: number): void {
    const buttonY = height - 50;
    const buttonWidth = 120;
    const buttonHeight = 40;
    const spacing = 140;
    const startX = width / 2 - (spacing * 1.5);

    const buttons = [
      { label: 'Inventory', action: () => console.log('Inventory clicked') },
      { label: 'Staff', action: () => console.log('Staff clicked') },
      { label: 'Market', action: () => console.log('Market clicked') },
      { label: 'Finance', action: () => console.log('Finance clicked') },
    ];

    buttons.forEach((button, index) => {
      const x = startX + (index * spacing);
      
      const buttonBg = this.add.rectangle(x, buttonY, buttonWidth, buttonHeight, 0x4a9eff);
      const buttonText = this.add.text(x, buttonY, button.label, {
        fontSize: '14px',
        color: '#ffffff',
      }).setOrigin(0.5);

      buttonBg.setInteractive({ useHandCursor: true });
      buttonBg.on('pointerover', () => buttonBg.setFillStyle(0x3a8eef));
      buttonBg.on('pointerout', () => buttonBg.setFillStyle(0x4a9eff));
      buttonBg.on('pointerdown', button.action);
    });
  }
}