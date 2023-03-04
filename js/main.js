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
    constructor(){
        this.posX = null;
        this.posY = 100;
        this.obstacleElm = null;

        this.createDomElement();
    }

    // adding a new DOM element
    createDomElement(){
        this.obstacleElm = document.createElement('div');
        this.obstacleElm.className = 'obstacle';

        this.obstacleElm.style.left = (Math.random() * 80) + 'vw'; // will need to adjust this after I have made board smaller and centered in screen

        const boardElm = document.getElementById('board'); 
        boardElm.appendChild(this.obstacleElm);
    }

    moveDown(){
        this.posY--;
        this.obstacleElm.style.bottom = this.posY + 'vh';
    } 
}

/* let x = Math.random() * 100; */


class Game {
    constructor() {
        this.player = null;
        this.obstaclesArr = [];
    }
    start(){
        this.player = new Player();
        this.attachEventListeners();

        // interval to create a bunch of divs
        setInterval(() => {
            const myObstacle = new Obstacle;
            this.obstaclesArr.push(myObstacle);
        }, 3000);

        // interval to move all the divs down
        setInterval(() => {
            this.obstaclesArr.forEach((obstacleInstance) => {
                obstacleInstance.moveDown();
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



