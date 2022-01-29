export class Lantern {
    sprite: Phaser.GameObjects.Sprite

    constructor(private scene: Phaser.Scene, x: number, y: number) {
        this.sprite = this.scene.add.sprite(
            x, y, 'master', 'latarnia1.png'
        ).setScale(3).setScale(4)

        
        this.scene.lights.addLight(
            x, y,
         200,
         0xffffff,
         0.5
       );
    }
}