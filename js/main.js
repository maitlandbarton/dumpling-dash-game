class Player {
    constructor(){
        this.positionX = 26;
        this.positionY = 0;
        this.width = 4;
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
            this.positionY += 2; 
        }
        this.playerElm.style.bottom = this.positionY + 'vh';
    }

    moveDown(){
        if (this.positionY > 0) {
            this.positionY -= 2;
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
        this.width = 10;
        this.height = 10;
        this.className = "dog-obstacle";
        
        this.move = null;
        this.createDomElement();
    }
    
    getDogSettings() {
        if (this.positionY % 20 === 0) {
            this.positionX = 60;
            this.move = -1;
        } else {
            this.positionX = -5;
            this.move = 1;
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
        this.positionY = Math.floor(Math.random() * 56 + 15);
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

class Bao extends Dumpling {
    constructor() {
        super();
        this.width = 6;
        this.height = 10;
        this.className = "bao-prize";

        this.createDumpling();
    }
}


class Bullet extends Obstacle {
    constructor (positionX, positionY) {
        super();
        this.positionX = positionX;
        this.positionY = positionY;
        this.width = 1;
        this.height = 2;
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
            this.positionY += 2;
        }
        this.obstacleElm.style.bottom = this.positionY + 'vh';
    }

    /* bulletLoop
        - create bullet (one time)
        - move bullet (continuously)
        - detect for collision
        - remove itself once collision detected
        - remove dog if collision detected
        - increase points (+10) */
}

class Game {
  constructor() {
    this.player = null;
    this.dogsArr = [];
    this.dumplingsArr = [];
    this.bulletsArr = [];
    this.baoArr = [];
    this.scoreElm = document.getElementById("score-count");
    this.livesCount = 3;
    this.livesElm = document.getElementById("lives-count");
    // this.lifeLossAudio = new Audio("./sounds/lost-life-meow.wav");

    this.updateLives();
  }
  start() {
    this.player = new Player();
    this.attachEventListeners();

    // interval to create divs
    setInterval(() => {
      const dog = new Dog();
      dog.getDogSettings(dog);
      this.dogsArr.push(dog);
    }, 1000 * (Math.floor(Math.random() * 4) + 1)); // maybe revisit this to get timing right for obstacles

    // interval to move all the divs right or left
    // turn this into a cleaner loop function
    setInterval(() => {
      this.dogsArr.forEach((obstacleInstance) => {
        obstacleInstance.moveDog();
        obstacleInstance.removeDog();
        if (!obstacleInstance.hasCollided) {
          if (this.detectCollision(this.player, obstacleInstance)) {
            obstacleInstance.hasCollided = true;
            this.livesCount--;
            obstacleInstance.removeObstacle();
            this.updateLives();
            this.loseGame();
          }
        }
      });
    }, 100);

    setInterval(() => {
      const newDumpling = new Dumpling();
      this.dumplingsArr.push(newDumpling);
    }, 3000);

    setInterval(() => {
      this.collectDumpling();
    }, 1);

    setInterval(() => {
        this.collectBao();
      }, 1);

    setInterval(() => {
        const newBao = new Bao();
        this.baoArr.push(newBao);
    }, 11000);

    setInterval(() => {
      this.bulletsArr.forEach((bullet, index) => {
        bullet.moveBullet();
        if (bullet.positionY > 66) {
          bullet.removeObstacle();
          this.bulletsArr.splice(index, 1);
        }
      });
      this.checkBulletHit(this.bulletsArr, this.dogsArr);
    }, 25);
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
            if (!obj1.hasCollided) {
            if (this.detectCollision(obj1, obj2)) {
                    console.log(true);
                    obj1.removeObstacle();
                    obj2.removeObstacle();
                    obj1.hasCollided = true;
                    this.addPoints(10);
                } 
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

  collectDumpling() {
    // clean this up!!
    this.dumplingsArr.forEach((dumpling) => {
      if (!dumpling.hasCollided) {
        if (this.detectCollision(this.player, dumpling)) {
          dumpling.hasCollided = true;
          dumpling.removeObstacle();
          this.addPoints(20);
        }
      }
    });
  }

  collectBao() {
    this.baoArr.forEach((bao) => {
        if (!bao.hasCollided) {
            if (this.detectCollision(this.player, bao)) {
                bao.hasCollided = true;
                bao.removeObstacle();
                this.livesCount++;
                this.updateLives();
            }
        }
    })
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
    // this.lifeLossAudio.play();
  }

  loseGame() {
    if (this.livesCount === 0) {
      window.location.href = "./gameover.html";
    }
  }
}

const newGame = new Game();
newGame.start();

