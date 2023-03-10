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
    // move player 
    moveLeft(){
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
        this.obstacleElm = document.createElement("div");
        this.obstacleElm.className = this.className;
        this.obstacleElm.style.bottom = this.positionY + 'vh';
        this.obstacleElm.style.width = this.width + 'vw';
        this.obstacleElm.style.height = this.height + 'vh';
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
            this.obstacleElm.style.backgroundImage = "url(../images/pug-running-right.png)"
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