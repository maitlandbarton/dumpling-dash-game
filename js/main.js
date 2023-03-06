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
    this.posY = Math.floor(Math.random() * 5) * 10 + 10;
    this.obstacleElm = null;
    this.move = null;
    this.boardElm = document.getElementById("board");

    this.createDomElement();
  }

  // adding a new DOM element
  createDomElement() {
    this.obstacleElm = document.createElement("div");
    this.obstacleElm.className = "obstacle";

    this.obstacleElm.style.bottom = this.posY + "vw"; // will need to adjust this after I have made board smaller and centered in screen

    this.boardElm.appendChild(this.obstacleElm);
  }

  getObstacleSettings() {
    if (this.posY % 20 === 0) {
        this.posX = 100; 
        this.move = -1; // entering from right, moving left. should be removed at far left side.
    } else {
        this.posX = -20;
        this.move = 1; // entering from left, moving right. should be removed at far right side. 
    }
  }

  moveObstacle() {
    this.posX += this.move;
    this.obstacleElm.style.left = this.posX + "vw";
  }

  removeObstacle() {
    if (this.posY % 20 === 0 && this.posX <= -5) {
        this.obstacleElm.remove();
    } else if (this.posY % 20 !== 0 && this.posX >= 95) {
        this.obstacleElm.remove();
    }
  }

}

class Dumpling {
    constructor() {
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
        this.dumplingElm.style.left = Math.floor(Math.random() * 80) + 'vw';
        this.boardElm.appendChild(this.dumplingElm);
    }

    removeDumplingElm() {
        setInterval(() => {
            this.dumplingElm.remove();
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
    }, 1000 * (Math.floor(Math.random() * 5) + 2));

    // interval to move all the divs right or left 
    setInterval(() => {
        this.obstaclesArr.forEach((obstacleInstance) => {
            obstacleInstance.moveObstacle();
            obstacleInstance.removeObstacle();
        })
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

  removeObstacle(obstacleInstance) {
    if (obstacleInstance.posY % 20 === 0 && obstacleInstance.posX <= -5) {
        obstacleInstance.obstacleElm.remove(); // remove from the dom
        this.obstaclesArr.shift();
    }
}

}




const newGame = new Game();
newGame.start();


/* removeObstacleIfOutside(obstacleInstance){
        if(obstacleInstance.positionY < 0){
            obstacleInstance.obstacleElm.remove(); //remove from the dom
            this.obstaclesArr.shift(); // remove from the array */

