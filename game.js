import Phaser from './Phaser.js'

import Votes from './votes.js'

export default class Game extends Phaser.Scene{
 
  
  
  player
  platforms
  cursors
  
  halfGameWidth
  gameHeight
  
  leftPressed
  rightPressed
  
  votes
  
  votesCollected = 0
  votesCollectedText
  
  constructor(){
    super('game')
  }
  
  init()
  {
    this.votesCollected = 0
  }
  preload()
  {
    this.load.image('background', 'res/bg.png')
    this.load.image('platform', 'res/platform.png')
    this.load.image('bunny-stand', 'res/dunko3.png')
    this.load.image('votes', 'res/votes.png')
    this.load.image('retry', 'res/retry.png')
    this.load.image('bunny-jump', 'res/dunko5.png')
    this.load.image('bg-plain', 'res/bg_plain.png')
    this.load.image('btn-play', 'res/btn_play.png')
    this.load.image('game-over', 'res/game-over.png')
    this.load.audio('jump', 'res/phew.mp3')
    this.load.audio('collect', 'res/collect.mp3')
    this.cursors = this.input.keyboard.createCursorKeys()
    this.input.addPointer(1)
  }
  create(){
   this.halfGameWidth = this.game.config.width
    this.halfGameWidth = this.halfGameWidth / 2
    this.gameHeight = this.game.config.height
    console.log(this.halfGameWidth)
    
    
    
    
    
    
   this.add.image(240, 320, 'background').setScrollFactor(1,0)
    //this.add.image(240, 320, 'platform').setScale(0.125)
   // this.physics.add.image(240, 320, 'platform').setScale(0.125)
   this.platforms = this.physics.add.staticGroup()
   for (let i = 0; i < 5; ++i){
     const x = Phaser.Math.Between(80, 400)
     const y = 150 * i
     
     const platform = this.platforms.create(x, y,'platform')
     platform.scale = 0.125
    const body = platform.body
    body.updateFromGameObject()
    
    // end of platform loop
   }
   
   //add the bunny-stand sprite to a const
   this.player = this.physics.add.image(240, 320, 'bunny-stand').setScale(0.10)
   this.physics.add.collider(this.platforms,this.player)
   this.player.body.checkCollision.up = false
   this.player.body.checkCollision.left = false
   this.player.body.checkCollision.right = false
   
   this.cameras.main.startFollow(this.player);
    this.cameras.main.setDeadzone(this.scale.width * 1.5)
    
    // create votes
    const vote = new Votes(this, 240, 320, 'votes')
   //this.add.existing(vote)
    this.votes = this.physics.add.group({
     classType: Votes
   })
    //this.votes.get(240, 320, 'votes')
    // create collision between votes and platform
    this.physics.add.collider(this.platforms, this.votes)
    
    this.physics.add.overlap(
      this.player,
      this.votes,
      this.handleCollectVotes, // called on overlap
      undefined,
      this
      )
      
      // create default text
      const style = {color: '#ff0000', fontSize: 24}
      this.votesCollectedText = this.add.text(240, 10, 'Votes: 0', style).setScrollFactor(0).setOrigin(0.5, 0)
   // end of create method
  }
  update(t, dt){
    // input
    this.leftPressed = false
    this.rightPressed = false
    
    // platform reuse
    this.platforms.children.iterate(child =>{
      const platform = child
      
      const scrollY = this.cameras.main.scrollY
      if (platform.y >= scrollY + 700){
        platform.y = scrollY - Phaser.Math.Between(50, 100)
        platform.body.updateFromGameObject()
        
        // add vote above platform being reused
        this.addVotesAbove(platform)
      }
    })
    // end of platform reuse code
    
    // bool touchingdown
    const touchingdown = this.player.body.touching.down
    if (touchingdown)
    {
      this.player.setVelocityY(-400)
      
      // switch to jump texture
      this.player.setTexture('bunny-jump')
      
      // play jump sound
      this.sound.play('jump')
    }
    
    const vy = this.player.body.velocity.y
    if (vy > 0 && this.player.texture.key !== 'bunny-stand'){
      
      //switch back to stand when falling
      this.player.setTexture('bunny-stand')
    }
    
    // end of touchingdown
    if (this.cursors.left.isDown && !touchingdown)
    {
      this.player.setVelocityX(-200)
    }
    else if (this.cursors.right.isDown && !touchingdown){
       this.player.setVelocityX(200)
     }
     else{
       this.player.setVelocityX(0)
     }
     // end keyboard input
     // attempt touch input
      // is touch pointer1 down?
      if (this.input.pointer1.isDown) {
 
      // is pointer1 horizontal position greater than half the canvas width?
      if (this.input.pointer1.x > this.halfGameWidth) {
 
      // right button is being pressed
      this.rightPressed = true;
      
     //  console.log('pressed right!')
      
      this.player.setVelocityX(200)
 
     // update report text
    // reportText += "Pointer1 on right side\n";
      }
      else if (this.input.pointer1.x < this.halfGameWidth) {
 
     // left button is being pressed
      this.leftPressed = true;
      
     // console.log('pressed left!')
      
      this.player.setVelocityX(-200)
 
     // update report text
      //reportText += "Pointer1 on left side\n";
      }
      else {
    this.player.setVelocity(0)
      }
        }
      this.horizontalwrap(this.player)
      
      const bottomPlatform = this.findBottomMostPlatform()
      if (this.player.y > bottomPlatform.y + 200){
        //console.log('game over!')
        // use scene instead
        this.scene.start('game_over')
      }
    }
    // end of update loop/ inside job method
    
    horizontalwrap(sprite){
      const halfWidth = sprite.displayWidth * 0.10
      const gameWidth = this.game.config.width
      if (sprite.x < -halfWidth){
        sprite.x = gameWidth +  halfWidth
      }
      else if (sprite.x > gameWidth + halfWidth){
        sprite.x = -halfWidth
      }
    }
    
    // end of reuse method, horizontalwrap
    
    addVotesAbove(sprite){
      // gets a y pos of sprite to place votes
      const y = sprite.y - sprite.displayHeight
      const vote = this.votes.get(sprite.x, y, "votes")
      
      // set votes active and visible
      vote.setActive(true)
      vote.setVisible(true)
      
      this.add.existing(vote)
      
      // update physics body size
      vote.body.setSize(vote.width, vote.height)
      
      // make sure physics is enabled
      this.physics.world.enable(vote)
      
      return vote
    }
    // end of place falling votes
    
    
    handleCollectVotes(player, vote)
    {
      // inside job
      // hide from displaying
      this.votes.killAndHide(vote)
      
      //inside job
      // disable from physics world
      this.physics.world.disableBody(vote.body)
      
      //increment by 1
      this.votesCollected++
      
      // play collect sound
       this.sound.play('collect')
      
      // create new text value and set
     const value = this.votesCollected
      this.votesCollectedText.text = ("Votes: " + value)
    }
    // end of handleCollectVotes
    
    // handle find bottomMostPlatform
    findBottomMostPlatform()
    {
      const platforms = this.platforms.getChildren()
      let bottomPlatform = platforms[0]
      
      for (let i = 1; i < platforms.length; i++)
      {
        const platform = platforms[i]
        // disregard platforms above current
        if (platform.y < bottomPlatform.y)
        {
          continue
        }
        bottomPlatform = platform
      }
      return bottomPlatform
      
      // end of findBottomMostPlatform method
    }
  
  // end of Game scene
}