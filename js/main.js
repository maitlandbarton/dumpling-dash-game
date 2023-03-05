class Player {
    constructor(){
        this.positionX = 0;
        this.positionY = 0;
        this.playerElm = document.getElementById("player");
    }

    moveLeft(){ // modify the position of the player
        this.positionX--;
        this.playerElm.style.left = this.positionX + 'vw';
    }

    moveRight(){
        this.positionX++;
        this.playerElm.style.left = this.positionX + 'vw';
    }

    moveUp(){
        this.positionY++; 
        this.playerElm.style.bottom = this.positionY + 'vh';
    }

    moveDown(){
        this.positionY--;
        this.playerElm.style.bottom = this.positionY + 'vh';
    }
}


class Obstacle {
  constructor() {
    this.posX = null;
    this.posY = Math.floor(Math.random() * 100);
    this.obstacleElm = null;
    this.move = null;

    this.createDomElement();
  }

  // adding a new DOM element
  createDomElement() {
    this.obstacleElm = document.createElement("div");
    this.obstacleElm.className = "obstacle";

    this.obstacleElm.style.bottom = Math.random() * 90 + "vw"; // will need to adjust this after I have made board smaller and centered in screen

    const boardElm = document.getElementById("board");
    boardElm.appendChild(this.obstacleElm);
  }

  getObstacleSettings() {
    if (this.posY % 2 === 0) {
        this.posX = 100;
        this.move = -1;
    } else if (this.posY % 2 === 1) {
        this.posX = -20;
        this.move = 1;
    }
  }

  moveObstacle() {
    this.posX += this.move;
    this.obstacleElm.style.left = this.posX + "vw";
  }

  
}


/*
randomPosition() {
    let posibility = Math.floor(Math.random() * 4); // 4==> one per each border

    switch (posibility) {
      case 0:
        this.coordXY[0] = Math.random() * (800 - this.width);
        this.coordXY[1] = -this.height;
        break;
      case 1:
        this.coordXY[0] = Math.random() * (800 - this.width);
        this.coordXY[1] = 600 + this.height ; 
        break;
      case 2:
        this.coordXY[0] = -this.width;
        this.coordXY[1] = Math.random() * (600 - this.height);
        break;
      case 3:
        this.coordXY[0] = 800 +this.width ;
        this.coordXY[1] = Math.random() * (600 - this.height);
        break;
    }
    return this.coordXY; */


class Game {
  constructor() {
    this.player = null;
    this.obstaclesArr = [];
  }
  start() {
    this.player = new Player();
    this.attachEventListeners();

    // interval to create divs and move them
    setInterval(() => {
      const myObstacle = new Obstacle();
      myObstacle.getObstacleSettings(myObstacle);
      this.obstaclesArr.push(myObstacle);
    }, 2000);

  
    // interval to move all the divs right or left 
    setInterval(() => {
        this.obstaclesArr.forEach((obstacleInstance) => {
            obstacleInstance.moveObstacle();
        });
    }, 100);
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
}


const newGame = new Game();
newGame.start();


