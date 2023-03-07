class Player {
    constructor(){
        this.positionX = 26;
        this.positionY = 0;
        this.width = 4;
        this.height = 10;

        this.playerElm = document.getElementById("player");

        this.playerElm.style.width = this.width + 'vw';
        this.playerElm.style.height = this.height + 'vh';
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
    this.positionY = Math.floor(Math.random() * 6) * 10 + 10;
    this.obstacleElm = null;
    this.move = null;
    this.width = 10;
    this.height = 10;

    this.boardElm = document.getElementById("board");

    this.createDomElement();
  }

  // adding a new DOM element
  createDomElement() {
    this.obstacleElm = document.createElement("div");
    this.obstacleElm.className = "obstacle";

    this.obstacleElm.style.bottom = this.positionY + "vh"; // will need to adjust this after I have made board smaller and centered in screen
    this.obstacleElm.style.width = this.width + 'vw';
    this.obstacleElm.style.height = this.height + 'vh';

    this.boardElm.appendChild(this.obstacleElm);
  }

  getObstacleSettings() {
    if (this.positionY % 20 === 0) {
        this.positionX = 60; 
        this.move = -1; // entering from right, moving left. should be removed at far left side.
    } else {
        this.positionX = -5;
        this.move = 1; // entering from left, moving right. should be removed at far right side. 
    }
  }

  moveObstacle() {
    this.positionX += this.move;
    this.obstacleElm.style.left = this.positionX + "vw";
  }

  removeObstacle() {
    if (this.positionY % 20 === 0 && this.positionX <= -5) {
        this.obstacleElm.remove();
    } else if (this.positionY % 20 !== 0 && this.positionX >= 95) {
        this.obstacleElm.remove();
    }
  }

}

class Dumpling {
    constructor() {
        this.dumplingElm = null;
        this.boardElm = document.getElementById("board");
        this.positionX = Math.floor(Math.random() * 55);
        this.positionY = Math.floor(Math.random() * 56 + 15);
        this.width = 5;
        this.height = 5;

        this.createDumplingElm();
        this.removeDumplingElm();
    }
    
    // adding a new DOM element
    createDumplingElm() {
        this.dumplingElm = document.createElement('div');
        this.dumplingElm.className = 'reward';
        this.dumplingElm.style.bottom = this.positionY + 'vh';
        this.dumplingElm.style.left = this.positionX + 'vw';
        this.dumplingElm.style.width = this.width + 'vw';
        this.dumplingElm.style.height = this.height + 'vh';
        this.boardElm.appendChild(this.dumplingElm);
    }

    removeDumplingElm() {
        setInterval(() => {
            this.dumplingElm.remove();
        }, 7000);
    }

    removeDumpling() {
        this.dumplingElm.remove(); //clean this up!!!
    }
}


class Game {
  constructor() {
    this.player = null;
    this.obstaclesArr = [];
    this.dumplingsArr = [];
    this.scoreElm = document.getElementById("score-count");
    this.livesElm = doucment.getElementById("lives-count");
    
  }
  start() {
    this.player = new Player();
    this.attachEventListeners();

    // interval to create divs
    setInterval(() => {
      const myObstacle = new Obstacle();
      myObstacle.getObstacleSettings(myObstacle);
      this.obstaclesArr.push(myObstacle);
    }, 1000 * (Math.floor(Math.random() * 3) + 1)); // maybe revisit this to get timing right for obstacles

    // interval to move all the divs right or left 
    setInterval(() => {
        this.obstaclesArr.forEach((obstacleInstance) => {
            obstacleInstance.moveObstacle();
            obstacleInstance.removeObstacle();
            this.detectCollision(obstacleInstance);
        })
    }, 100);

    setInterval(() => {
        const newDumpling = new Dumpling();
        this.dumplingsArr.push(newDumpling);
    }, 3000);

    setInterval(() => {
        this.collectDumpling() 
        }, 1);
    
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
      }
    });
  }
  
  detectCollision(object) {
    if (
        this.player.positionX < object.positionX + object.width &&
        this.player.positionX + this.player.width > object.positionX &&
        this.player.positionY < object.positionY + object.height &&
        this.player.height + this.player.positionY > object.positionY
    ) {
        return true;
    } else {
        return false;
    }
  }

  collectDumpling() { // clean this up!!
    this.dumplingsArr.forEach((dumpling) => {
        if (this.detectCollision(dumpling) === true) {
            dumpling.removeDumpling();
            this.dumplingsArr.splice(dumpling, 1);
            this.addPoints();
        }
    });
  }

  addPoints() {
    const addPoints = parseInt(this.scoreElm.textContent, 10) + 20;
    this.scoreElm.innerText = addPoints.toString();
    return addPoints;
  }

  updateLives () {
    const subtractLife = parseInt(this.livesElm.textContent,10) - 1;
    if (this.detectCollision()
  }

}


/* if (this.detectCollision(obstacleInstance) === true) {
                this.obstaclesArr.splice(obstacleInstance,1);
            } */

const newGame = new Game();
newGame.start();

 
 function updateLives () {
    const livesElm = document.getElementById("lives-count");
    const subtractLife = parseInt(livesElm.textContent, 10) - 1;
    /* if (collisionDetection(obstacle) === true) {
        livesElm.innerText = subtractLife.toString();
        return subtractLife;
    }
     */
 }

 /* function loseGame () {
    if (this.livesElm.innerText === '0') {
        window.location.href = "./gameover.html";
    }
 } */

 // if collision with obstacle is detected, -1 life
 // starting point for lives is 3
 // have this reflected on the dom as well

 // detect game loss once lives = 0