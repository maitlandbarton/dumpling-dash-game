
class Player {
    constructor(){
        this.positionX = 26;
        this.positionY = 0;
        this.width = 5;
        this.height = 10;

        this.playerElm = document.getElementById("player");

        this.playerElm.style.width = this.width + 'vw';
        this.playerElm.style.height = this.height + 'vh';
        this.playerElm.style.left = this.positionX + 'vw';
    }

    moveLeft(){ // modify the position of the player
        if (this.positionX > 0) {
            this.positionX -= 2;
        }
        this.playerElm.style.left = this.positionX + 'vw';
    }

    moveRight(){
        if (this.positionX < 56) {
            this.positionX += 2;
        }
        this.playerElm.style.left = this.positionX + 'vw';
    }

    moveUp(){
        if (this.positionY <= 58) {
            this.positionY += 3; 
        }
        this.playerElm.style.bottom = this.positionY + 'vh';
    }

    moveDown(){
        if (this.positionY > 0) {
            this.positionY -= 3;
        }
        this.playerElm.style.bottom = this.positionY + 'vh';
    }
}

class Obstacle {
    constructor() {
        this.positionX = null;
        this.positionY = null;
        this.obstacleElm = null;
        this.width = null;
        this.height = null;
        this.className = null;  
        this.hasCollided = false;
        this.boardElm = document.getElementById("board");
    }

    createDomElement() {
        // prep the dom element
        this.obstacleElm = document.createElement("div");

        //give attributes
        this.obstacleElm.className = this.className;
        this.obstacleElm.style.bottom = this.positionY + 'vh';
        this.obstacleElm.style.width = this.width + 'vw';
        this.obstacleElm.style.height = this.height + 'vh';

        // add to DOM
        this.boardElm.appendChild(this.obstacleElm);
    }

    removeObstacle() {
        this.obstacleElm.remove();
    }
}

class Dog extends Obstacle { 
    constructor() {
        super();
        this.positionY = Math.floor(Math.random() * 6) * 10 + 10;
        this.width = 12;
        this.height = 9;
        this.className = "dog-obstacle";
        
        this.move = null;
        this.createDomElement();
    }
    
    getDogSettings() {
        if (this.positionY % 20 === 0) {
            this.positionX = 60;
            this.move = -((Math.random() * 2.5) + 1);
        } else {
            this.positionX = -5;
            this.move = (Math.random() * 2.5) + 1;
            this.obstacleElm.style.backgroundImage = `url("../images/pug-running-right.png")`
        }
    }

    moveDog() {
        this.positionX += this.move;
        this.obstacleElm.style.left = this.positionX + "vw";
    }

    removeDog() {
        if (this.positionY % 20 === 0 && this.positionX <= -5) {
            this.removeObstacle();
        } else if (this.positionY % 20 !== 0 && this.positionX >= 95) {
            this.removeObstacle();
        }
    }
}

class Dumpling extends Obstacle {
    constructor() {
        super();
        this.positionX = Math.floor(Math.random() * 55);
        this.positionY = Math.floor(Math.random() * 51 + 15);
        this.width = 5;
        this.height = 5;
        this.className = "dumpling-prize";

        this.createDumpling();
        this.removeAuto();
    }

    createDumpling() {
        this.createDomElement();
        this.obstacleElm.style.left = this.positionX + 'vw';
    }
    
    removeAuto() {
        setInterval(() => {
            this.removeObstacle();
        }, 7000);
    }
} 

class Bullet extends Obstacle {
    constructor (positionX, positionY) {
        super();
        this.positionX = positionX;
        this.positionY = positionY;
        this.width = 3;
        this.height = 3;
        this.className = "bullet";

        this.createBullet();
    }

    createBullet() {
        this.createDomElement();
        this.obstacleElm.style.left = this.positionX + 'vw';
        this.obstacleElm.style.bottom = this.positionY + 'vh';
    }

    moveBullet() {
        if (this.positionY <= 68) {
            this.positionY += 1;
        }
        this.obstacleElm.style.bottom = this.positionY + 'vh';
    }
}

class Game {
  constructor() {
    this.player = null;
    this.dogsArr = [];
    this.dumplingsArr = [];
    this.bulletsArr = [];
    this.gameOver = document.querySelector('#gameover');
    this.scoreElm = document.getElementById("score-count");
    this.livesCount = 3;
    this.dogInterval = null; // create a get Intervals method
    this.moveDogInterval = null;
    this.makeDumplingInterval = null;
    this.collectRewardsInterval = null;
    this.bulletInterval = null;
    this.livesElm = document.getElementById("lives-count");
    this.lifeLossAudio = new Audio("./sounds/lost-life-meow.wav");
    this.swallowAudio = new Audio("./sounds/swallow.mp3");
    this.loseAudio = new Audio("./sounds/lose-game.wav");

    this.updateLives();
  }
  start() {
    this.player = new Player();
    this.attachEventListeners();
    this.scoreElm.innerText = '0';
    document.querySelector('#scoreboard').style.visibility = 'visible';
    

    // interval to create divs
    this.dogInterval = setInterval(() => {
      const dog = new Dog();
      dog.getDogSettings(dog);
      this.dogsArr.push(dog);
    }, 500 * (Math.floor(Math.random() * 5) + 2));

    // interval to move all the divs right or left
    // turn this into a cleaner loop function
    this.moveDogInterval = setInterval(() => {
      this.dogsArr.forEach((obstacleInstance) => {
        obstacleInstance.moveDog();
        obstacleInstance.removeDog();
        if (!obstacleInstance.hasCollided) {
          if (this.detectCollision(this.player, obstacleInstance)) {
            obstacleInstance.hasCollided = true;
            this.livesCount--;
            obstacleInstance.removeObstacle();
            this.updateLives();
            this.lifeLossAudio.play();
            this.loseGame();
          }
        }
      });
    }, 100);

    this.makeDumplingInterval = setInterval(() => {
      const newDumpling = new Dumpling();
      this.dumplingsArr.push(newDumpling);
    }, 3000);

    this.collectRewardsInterval = setInterval(() => {
      this.collectElements();
    }, 1);

    this.bulletInterval = setInterval(() => {
      this.bulletsArr.forEach((bullet, index) => {
        bullet.moveBullet();
        if (bullet.positionY > 66) {
          bullet.removeObstacle();
          this.bulletsArr.splice(index, 1);
        }
      });
      this.checkBulletHit(this.bulletsArr, this.dogsArr);
    }, 20);
  }

  attachEventListeners() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        this.player.moveLeft();
      } else if (e.key === "ArrowRight") {
        this.player.moveRight();
      } else if (e.key === "ArrowUp") {
        this.player.moveUp();
      } else if (e.key === "ArrowDown") {
        this.player.moveDown();
      } else if (e.key === " ") {
        this.shootBullet();
      }
    });
  }

   checkBulletHit(arr1, arr2) {
    for (let i = arr1.length - 1; i >= 0; i--) {
        for (let j = arr2.length - 1; j >= 0 ; j--) {
            let obj1 = arr1[i];
            let obj2 = arr2[j];
            if (this.detectCollision(obj1, obj2)) {
                if (!obj1.hasCollided) {
                    obj1.removeObstacle();
                    obj1.hasCollided = true;
                    this.addPoints(10);
                }
                    obj2.removeObstacle();
                    obj2.obstacleElm.splice(obj2, 1);
                } 
            } 
        } 
    } 

  detectCollision(obj1, obj2) {
    if (
      obj1.positionX < obj2.positionX + obj2.width &&
      obj1.positionX + obj1.width > obj2.positionX &&
      obj1.positionY < obj2.positionY + obj2.height &&
      obj1.height + obj1.positionY > obj2.positionY
    ) {
      return true;
    } else {
      return false;
    }
  }


  collectElements() {
    this.dumplingsArr.forEach((dumpling) => {
        if (!dumpling.hasCollided && this.detectCollision(this.player, dumpling)) {
            dumpling.hasCollided = true;
            dumpling.removeObstacle();
            this.addPoints(20);
            this.swallowAudio.play();
        }
    });
  }

  shootBullet() {
    const bullet = new Bullet(this.player.positionX + 2, this.player.positionY + 5);
    this.bulletsArr.push(bullet);
  }

  addPoints(num) {
    const addPoints = parseInt(this.scoreElm.textContent, 10) + num;
    this.scoreElm.innerText = addPoints.toString();
    return addPoints;
  }

  updateLives() {
    this.livesElm.innerText = this.livesCount.toString();
  }

  loseGame() {
    if (this.livesCount === 0) {
      this.gameOver.style.visibility = 'visible';
      document.querySelector('#final-score').innerText = this.scoreElm.innerText;
      document.querySelector('#scoreboard').style.visibility = 'hidden';
      this.lifeLossAudio = null; // make a killAudio function and a getAudio function
      this.swallowAudio = null;
      this.loseAudio.play();
    }
  }
}


const startPage = document.querySelector('#intro-page');
const startBtn = document.querySelector('#start-btn');

const playAgainBtn = document.querySelector('#play-again-btn');


startBtn.addEventListener("click", () => {
    startPage.style.display = "none";
    let game = new Game;
    game.start();
})

playAgainBtn.addEventListener("click", () => {
    window.location.reload();
})