import Phaser from './Phaser.js'

export default class Votes extends Phaser.Physics.Arcade.Sprite
{
  constructor(scene, x, y, texture)
  {
    super(scene, x, y, texture)
    this.setScale(0.10)
  }
  /*
  preload()
  {
    this.load.image("votes", "res/votes.png")
  }*/
}