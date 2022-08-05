import Phaser from './phaser.js';
import MenuScreen from './menu_screen.js'
import Game from './game.js'
import GameOver from './game_over.js'

var gameConfig =  {
  width: 480,
  height: 640,
  scale: {  mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,  autoCenter: Phaser.Scale.CENTER_BOTH,  parent: "thegame",  width: 480,  height: 640},
  scene: [MenuScreen, Game, GameOver],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 200
      },
      debug: false
     // debug: true
    }
  }
}



export default new Phaser.Game(gameConfig)

//console.log("hello world!");
console.dir(Phaser);

/*
// modules to import
import Phaser from 'phaser';
import { PlayGame} from './playGame';
 
// object to initialize the Scale Manager
scaleObject: Phaser.Types.Core.ScaleConfig = {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: 'thegame',
    width: 500,
    height: 500
}
 
// game configuration object
configObject: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    scale: scaleObject,
    scene: [PlayGame]
}
 
// the game itself
new Phaser.Game(configObject);
*/