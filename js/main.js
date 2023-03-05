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

class Dumpling {
    constructor() {
        this.positionX = null;
        this.positionY = null;
        this.dumplingElm = null;
        this.boardElm = document.getElementById("board");

        this.createDumplingElm();
        this.removeDumplingElm();
    }
    
    // adding a new DOM element
    createDumplingElm() {
        this.dumplingElm = document.createElement('div');
        this.dumplingElm.className = 'reward';
        this.dumplingElm.style.top = Math.floor(Math.random() * 100) + 'vh';
        this.dumplingElm.style.left = Math.floor(Math.random() * 100) + 'vw';
        this.boardElm.appendChild(this.dumplingElm);
    }

    removeDumplingElm() {
        setInterval(() => {
            this.dumplingElm.parentNode.removeChild(this.dumplingElm);
        }, 5000);
    }
}


class Game {
  constructor() {
    this.player = null;
    this.obstaclesArr = [];
    this.dumplingsArr = [];
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

    setInterval(() => {
        const newDumpling = new Dumpling();
        this.dumplingsArr.push(newDumpling);
    }, 3000);
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


