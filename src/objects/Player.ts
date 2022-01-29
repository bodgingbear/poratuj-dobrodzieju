import { PEE_DEFAULT_VALUE, PEE_MAX_VALUE } from 'constants';

import { PissDrop } from './PissDrop';

const PLAYER_VELOCITY = 150;

export class Player {
  public sprite: Phaser.GameObjects.Sprite;

  public pee: number = PEE_DEFAULT_VALUE;

  public body: Phaser.Physics.Arcade.Body;

  private targetToMouseRotation: number = 0;

  private pointer: Phaser.Input.Pointer | null = null;

  private rotation = 0;

  constructor(
    private scene: Phaser.Scene,
    x: number,
    y: number,
    private keys: Phaser.Types.Input.Keyboard.CursorKeys,
    private pissDrops: Phaser.GameObjects.Group,
    private noPee: (() => void) | null = null
  ) {
    this.sprite = this.scene.add
      .sprite(x, y, 'master', 'Andrzej-Drunk-Down.png')
      .setScale(4)
      .setPipeline('Light2D');

    this.sprite.setOrigin(0.5);

    scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      this.pointer = pointer;
    });

    this.scene.physics.world.enable(this.sprite);
    this.body = this.sprite.body as Phaser.Physics.Arcade.Body;
    this.body.setCollideWorldBounds(true);

    const cursorKeys = scene.input.keyboard.createCursorKeys();

    const pissDropDeathEmitterManager = scene.add
      .particles('master', 'piss-drop.png')
      .setPipeline('Light2D');

    this.scene.time.addEvent({
      delay: 40,
      loop: true,
      callback: () => {
        if (this.pee < 0) {
          this.noPee?.();
          return;
        }
        if (cursorKeys.space?.isDown || this.pointer?.isDown) {
          this.pee--;
          this.pissDrops.add(
            new PissDrop(
              this.scene,
              this.rotation,
              this.body.position.add(
                new Phaser.Math.Vector2(
                  this.sprite.displayWidth / 2,
                  this.sprite.displayHeight * 0.7
                )
              ),
              this.body.velocity,
              pissDropDeathEmitterManager
            ).sprite.setDepth(
              this.sprite.frame.name === 'Andrzej-Drunk-Up.png'
                ? this.sprite.depth - 0.1
                : this.sprite.depth + 0.1
            )
          );
        }
      },
    });
  }

  update() {
    let velocity = new Phaser.Math.Vector2(0, 0);

    if (this.keys.up?.isDown) {
      velocity.subtract(new Phaser.Math.Vector2(0, PLAYER_VELOCITY * 1.5));
    }

    if (this.keys.down?.isDown) {
      velocity.add(new Phaser.Math.Vector2(0, PLAYER_VELOCITY * 1.5));
    }

    if (this.keys.left?.isDown) {
      velocity.subtract(new Phaser.Math.Vector2(PLAYER_VELOCITY, 0));
    }

    if (this.keys.right?.isDown) {
      velocity.add(new Phaser.Math.Vector2(PLAYER_VELOCITY, 0));
    }

    if (velocity.x !== 0 && velocity.y !== 0) {
      velocity = velocity.normalize().scale(PLAYER_VELOCITY);
    }

    this.body.setVelocity(velocity.x, velocity.y);

    if (this.pointer) {
      this.targetToMouseRotation = Phaser.Math.Angle.BetweenPoints(
        this.body,
        new Phaser.Math.Vector2(
          this.scene.input.mousePointer.x + this.scene.cameras.main.scrollX,
          this.scene.input.mousePointer.y + this.scene.cameras.main.scrollY
        )
      );

      this.rotation = this.targetToMouseRotation;

      // Phaser.Math.Angle.RotateTo(
      //   this.rotation,
      //   this.targetToMouseRotation,
      //   ROTATION_SPEED * 0.001 * delta
      // );

      const normalRotation = Phaser.Math.Angle.Normalize(this.rotation);

      if (normalRotation > Math.PI * 1.75 || normalRotation < Math.PI / 4) {
        this.sprite.setFrame('Andrzej-Drunk-Right.png');
      } else if (
        normalRotation >= Math.PI / 4 &&
        normalRotation < (Math.PI * 3) / 4
      ) {
        this.sprite.setFrame('Andrzej-Drunk-Down.png');
      } else if (
        normalRotation >= (Math.PI * 3) / 4 &&
        normalRotation < Math.PI * 1.25
      ) {
        this.sprite.setFrame('Andrzej-Drunk-Left.png');
      } else if (
        normalRotation >= Math.PI * 1.25 &&
        normalRotation <= 2 * Math.PI
      ) {
        this.sprite.setFrame('Andrzej-Drunk-Up.png');
      }
    }
  }

  public addPiss = (pissCount: number) => {
    this.pee = Math.max(this.pee + pissCount, PEE_MAX_VALUE);
  };
}
