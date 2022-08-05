import Phaser from './Phaser.js'

export default class MenuScreen extends Phaser.Scene
{
  btn_play
  
  preload()
  {
    this.load.image('bg-plain', 'res/bg_plain.png')
    this.load.image('btn-play', 'res/btn_play.png')
  }
  
  constructor()
  {
    super('menu_screen')
  }
  
  create()
  {
    
    this.add.image(240, 320, 'bg-plain')
   this.btn_play = this.add.image(240, 500, 'btn-play')
    
    this.btn_play.setInteractive()
    this.btn_play.on('pointerdown', () => {this.scene.start('game')})
  }
}