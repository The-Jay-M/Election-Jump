import Phaser from './Phaser.js'

export default class GameOver extends Phaser.Scene
{
  retry
  constructor(){
    super('game_over')
  }
  
  create()
  {
    const width = this.scale.width
    const height = this.scale.height
    
    //this.add.text(width * 0.5, height * 0.5, "Game Over!", {fontSize: 48}).setOrigin(0.5)
    this.add.image(240, 320, 'game-over')
   this.retry = this.add.image(240, 500, 'retry')
   this.retry.setInteractive()
   this.retry.on("pointerdown", () => {this.scene.start("game")})
  }
}