class Game {
  constructor() {
    this.player = null;
    this.dogsArr = [];
    this.dumplingsArr = [];
    this.bulletsArr = [];
    this.livesCount = 3;

    this.getElements();
    this.getAudio();
  }
  start() {
    this.player = new Player();
    this.attachEventListeners();
    this.updateLives();
    this.scoreElm.innerText = '0';
    this.scoreBoard.style.visibility = 'visible';

    // generate dogs loop
    setInterval(() => {
      const dog = new Dog();
      dog.getDogSettings(dog);
      this.dogsArr.push(dog);
    }, 500 * (Math.floor(Math.random() * 5) + 2));

    // dog obstacle loop
    setInterval(() => {
      this.dogsArr.forEach((dogInstance) => {
        dogInstance.moveDog();
        dogInstance.removeDog();
        // dogCollide(obj) function?
        if (!dogInstance.hasCollided && !dogInstance.hasBeenShot) {
          if (this.detectCollision(this.player, dogInstance)) {
            dogInstance.hasCollided = true;
            this.livesCount--;
            dogInstance.removeObstacle();
            this.updateLives();
            this.lifeLossAudio.play();
            this.loseGame();
          }
        }
      });
    }, 100);

    // generate dumplings
    setInterval(() => {
      const newDumpling = new Dumpling();
      this.dumplingsArr.push(newDumpling);
    }, 3000);

    // collect dumplings
    setInterval(() => {
      this.collectElements();
    }, 1);

    setInterval(() => {
      this.bulletsArr.forEach((bullet, index) => {
        bullet.moveBullet();
        if (bullet.positionY > 66) {
          bullet.removeObstacle();
          this.bulletsArr.splice(index, 1);
        }
      });
      this.checkBulletHit(this.bulletsArr, this.dogsArr);
    }, 10);
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

  // detect bullet + dog collision
   checkBulletHit(arr1, arr2) {
    for (let i = arr1.length - 1; i >= 0; i--) {
        for (let j = arr2.length - 1; j >= 0 ; j--) {
            let obj1 = arr1[i];
            let obj2 = arr2[j];
            if (this.detectCollision(obj1, obj2)) {
                if (!obj1.hasCollided) {
                    obj1.removeObstacle();
                    obj1.hasCollided = true;
                    obj1.hasBeenShot = true;
                    console.log(obj1.hasCollided);
                    this.addPoints(10);
                    this.splatAudio.play();
                }
                    obj2.removeObstacle();
                } 
            } 
        } 
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

  stopAudio() {
    this.lifeLossAudio = null;
    this.swallowAudio = null;
  }

  loseGame() {
    if (this.livesCount === 0) {
      this.gameOver.style.visibility = 'visible';
      this.finalScore.innerText = this.scoreElm.innerText; 
      this.scoreBoard.style.visibility = 'hidden';
      this.stopAudio();
      this.loseAudio.play();
    }
  }

  getAudio() {
    this.lifeLossAudio = new Audio("./sounds/lost-life-meow.wav");
    this.swallowAudio = new Audio("./sounds/swallow.mp3");
    this.loseAudio = new Audio("./sounds/lose-game.wav");
    this.splatAudio = new Audio("./sounds/cartoon-splat.mp3");
  }

  getElements() {
    this.gameOver = document.querySelector('#gameover');
    this.scoreElm = document.getElementById("score-count");
    this.livesElm = document.getElementById("lives-count");
    this.finalScore = document.getElementById('final-score');
    this.scoreBoard = document.getElementById('scoreboard');
  }
}

// get button & start page elements
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