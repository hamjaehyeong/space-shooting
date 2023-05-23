let gameOverSound = document.getElementById('gameOverSound');
//canvas setting
let gameOn = false;

let score = 0;

let canvas;
let ctx;
canvas = document.createElement("canvas")
ctx = canvas.getContext("2d")

const mainElement = document.getElementById('main');


canvas.width = 400;
canvas.height = 700;
mainElement.appendChild(canvas);

//스크롤링
let bgY1 = 0;
let bgY2 = -canvas.height;
let bgSpeed = 1;

let backgroundImage, spaceshipImage, bulletImage, enemyImage, gameOverImage;

//우주선 좌표
let spaceshipX = canvas.width / 2 - 32;
let spaceshipY = canvas.height - 64;


function loadImage() {
    backgroundImage = new Image();
    backgroundImage.src = "image/background.jpg";

    spaceshipImage = new Image();
    spaceshipImage.src = "image/player.png";

    bulletImage = new Image();
    bulletImage.src = "image/bullet.png";

    enemyImage = new Image();
    enemyImage.src = "image/enemy-big.png";

    gameOverImage = new Image();
    gameOverImage.src = "image/gameover.png"
}


function playGameOverSound() {
   // gameOverSound.play();
}
function playBulletSound() {
    let createBulletSound = document.createElement('audio')
    createBulletSound.src = "sound/bulletSound.mp3"
    createBulletSound.preload = "auto"
    document.body.append(createBulletSound)
    createBulletSound.play();

    // 1.2초 후에 오디오 요소를 삭제합니다.
    setTimeout(function () {
        createBulletSound.remove();
    }, 1200);
}

function playExplosionSound() {
    let createExplosionSound = document.createElement('audio')
    createExplosionSound.src = "sound/explosionSound.mp3"
    createExplosionSound.preload = "auto"
    document.body.append(createExplosionSound)
    createExplosionSound.play();

    // 1.2초 후에 오디오 요소를 삭제합니다.
    setTimeout(function () {
        createExplosionSound.remove();
    }, 1200);
}


let keysDown = {}

let bulletList = []// 총알을 저장하는 리스트
function Bullet() {
    this.x = 0;
    this.y = 0;
    this.init = function () {
        this.x = spaceshipX + 14;
        this.y = spaceshipY - 10;
        this.alive = true;
        bulletList.push(this)
    }
    this.update = function () {
        this.y -= 7;
    };
    this.checkHit = function () {
        for (let i = 0; i < enemyList.length; i++) {
            if (this.y <= enemyList[i].y
                && this.x >= enemyList[i].x
                && this.x <= enemyList[i].x + 32) {
                score++;
                this.alive = false;
                enemyList.splice(i, 1)
                playExplosionSound()
                break;
            }
        }
    }
    this.checkOut = function () {
        if (this.y < 0) {
            this.alive = false;

        }
    }
}
function generateRandomValue(min, max) {
    let randomNum = Math.floor(Math.random() * (max - min + 1)) + min
    return randomNum
}

let enemyList = []// 적(big)을 저장하는 리스트
function Enemy() {
    this.x = 0;
    this.y = 0;
    this.init = function () {
        this.x = generateRandomValue(0, canvas.width - 40)
        enemyList.push(this)
    }
    this.update = function () {
        this.y += 2; //enemy 속도 조절

        if (this.y >= canvas.height - 32) {
            gameOn = false;
        }
    }
}

function createEnemy() {
    let e = new Enemy;
    e.init();
}



let timeoutId;

function createEnemyWrapper() {
    createEnemy();

    if (gameOn) {
        timeoutId = setTimeout(createEnemyWrapper, (Math.random() + 0.1) * 800);
    }
    console.log(enemyList)
}



function createBullet() {
    let b = new Bullet;    
    b.init();
}

function setupKeyboardListener() {
    document.addEventListener("keydown", function (event) {
        keysDown[event.key] = true;

    })
    document.addEventListener("keyup", function (event) {
        delete keysDown[event.key]

        if (event.key === " " && gameOn === true) {
            createBullet(); //총알 생성
            playBulletSound();
        }

    })
}


function update() {
    if ('ArrowRight' in keysDown) {
        spaceshipX += 5;
    }
    if ('ArrowLeft' in keysDown) {
        spaceshipX -= 5;
    }

    if (spaceshipX <= 0) { spaceshipX = 0; }
    if (spaceshipX >= 352) { spaceshipX = 352; }



    for (let i = 0; i < bulletList.length; i++) {
        if (bulletList[i].alive) {
            bulletList[i].update()
            bulletList[i].checkHit()
            bulletList[i].checkOut()
            if (!bulletList[i].alive) {
                bulletList.splice(i, 1)
            }

        }

    }

    for (let i = 0; i < enemyList.length; i++) {
        enemyList[i].update()
    }

}

function render() {
    ///
    ctx.drawImage(backgroundImage, 0, bgY1, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, bgY2, canvas.width, canvas.height);
    bgY1 += bgSpeed;
    bgY2 += bgSpeed;
    ////////

    if (bgY1 > canvas.height) {
        bgY1 = -canvas.height;
    }

    // 두 번째 배경 이미지가 화면 밖으로 완전히 나가면 다시 화면 위로 올림
    if (bgY2 > canvas.height) {
        bgY2 = -canvas.height;
    }


    ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY)
    ctx.fillText(`Score:${score}`, 20, 30)
    ctx.fillStyle = 'white'
    ctx.font = "20px Arial"

    for (let i = 0; i < bulletList.length; i++) {
        if (bulletList[i].alive) {
            ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y)
        }

    }
    for (let i = 0; i < enemyList.length; i++) {
        ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y)
    }

}


let bodyElement = document.body
let startButtonElement = document.querySelector('.startButton');

function clearEnemyList() {
    while (enemyList.length > 0) {
        enemyList.pop();
    }
}

//메인
function main() {
    if (gameOn) {
        update();
        render();
        requestAnimationFrame(main);
    }
    else {
        ctx.drawImage(gameOverImage, 50, 150, 300, 300);
        clearTimeout(timeoutId);
        playGameOverSound();
        clearEnemyList();
        restart();
    }
}


startButtonElement.addEventListener('click', function () {

    bodyElement.classList.remove('overlay');


    gameOn=true;

    loadImage();
    setupKeyboardListener();

    createEnemyWrapper();
    main();

    startButtonElement.remove();
});

function restart() {
    let restartButtonElement = document.createElement('button');
    restartButtonElement.className = 'startButton';
    restartButtonElement.textContent = '재시작';
    document.body.append(restartButtonElement);
    bodyElement.classList.add('overlay')
    restartButtonElement.addEventListener('click', function () {
        gameOn = true;
        bodyElement.classList.remove('overlay')
        restartButtonElement.remove();
        score=0;
        main();
        createEnemyWrapper();
    })
}
