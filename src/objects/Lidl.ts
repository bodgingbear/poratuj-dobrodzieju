import { Player } from './Player';

export class Lidl {
  public sprite: Phaser.GameObjects.Sprite;

  private body: Phaser.Physics.Arcade.Body;

  constructor(private scene: Phaser.Scene, player: Player) {
    this.sprite = this.scene.add
      .sprite(3040 / 2, 1600 / 2, 'master', 'lidl.png')
      .setScale(4)
      .setPipeline('Light2D')
      .setDepth(1);

    this.sprite.setOrigin(0.2);

    this.scene.physics.world.enable(this.sprite);
    this.body = this.sprite.body as Phaser.Physics.Arcade.Body;
    this.scene.physics.add.collider(this.sprite, player.sprite);
    this.body.setImmovable(true);
  }
}
