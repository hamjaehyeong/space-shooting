
//canvas setting
let gameOn = true;

let score=0;

let canvas;
let ctx;
canvas = document.createElement("canvas")
ctx = canvas.getContext("2d")

canvas.width=400;
canvas.height=700;
document.body.appendChild(canvas);

////////////////////////////
let bgY1 = 0;
let bgY2 = -canvas.height;
let bgSpeed = 1;
/////////////////////////////

let backgroundImage, spaceshipImage,bulletImage,enemyImage,gameOverImage;

//우주선 좌표
let spaceshipX = canvas.width/2-32;
let spaceshipY = canvas.height-64;


function loadImage() {
    backgroundImage = new Image();
    backgroundImage.src="image/background.jpg";

    spaceshipImage = new Image();
    spaceshipImage.src="image/player.png";

    bulletImage = new Image();
    bulletImage.src="image/bullet.png";

    enemyImage = new Image();
    enemyImage.src = "image/enemy-big.png";

    gameOverImage = new Image();
    gameOverImage.src ="image/gameover.png"
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
                break;
            }
        }
    }
    this.checkOut = function () {
       if(this.y<0){
        this.alive=false;

       } 
    }
}
function generateRandomValue(min, max) {
    let randomNum = Math.floor(Math.random()*(max-min+1))+min
    return randomNum
}

let enemyList = []// 적(big)을 저장하는 리스트
function Enemy() {
    this.x=0;
    this.y=0;
    this.init=function () {
        this.x = generateRandomValue(0, canvas.width-32)
        enemyList.push(this)
    }
    this.update = function () {
        this.y += 2; //enemy 속도 조절
        
        if(this.y>=canvas.height -32){
            gameOn =false;
            console.log("오버")
        }
    }
}

function createEnemy() {
    let e = new Enemy;
    e.init();
    console.log("적생성");
}   



/////
let timeoutId;

function createEnemyWrapper() {
    createEnemy();

    // If the game is still on, set up the next call.
    if (gameOn) {
        timeoutId = setTimeout(createEnemyWrapper, (Math.random() + 0.1) * 800);
    }
}


///////


function createBullet(){
    let b = new Bullet;    //여기서 궁금한점: 여러개를 만들면 b가 중복되는거 아님?
    b.init();

    console.log("총알생성");
    console.log("새로운총알리스트",bulletList);

}

function setupKeyboardListener(){
    document.addEventListener("keydown", function(event){
        keysDown[event.key] = true;
        console.log('값은?', keysDown);
    })
    document.addEventListener("keyup", function(event){
        delete keysDown[event.key]

        if(event.key===" "){
            createBullet() //총알 생성
        }

    })
}


function update() {
    if( 'ArrowRight' in keysDown){
        spaceshipX+=5;
    }
    if( 'ArrowLeft' in keysDown){
        spaceshipX-=5;
    }
    
    if(spaceshipX<=0){spaceshipX=0;}
    if(spaceshipX>=352){spaceshipX=352;}



    for (let i = 0; i < bulletList.length; i++) {
        if(bulletList[i].alive){
        bulletList[i].update()
        bulletList[i].checkHit()
        bulletList[i].checkOut()
        if(!bulletList[i].alive){
            bulletList.splice(i,1)
        }

    }
  
    }
    
    for (let i = 0; i < enemyList.length; i++) {
        enemyList[i].update()
    }

}

function render(){
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
    ctx.fillText(`Score:${score}`,20, 30)
    ctx.fillStyle = 'white'
    ctx.font ="20px Arial"

    for (let i = 0; i < bulletList.length; i++) {
        if(bulletList[i].alive){
            ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y)
        }
        
    }
    for (let i = 0; i < enemyList.length; i++) {
        ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y)
    }

}

function main() {
   if(gameOn){
    update();
    render();
    requestAnimationFrame(main);} 
    else{
        ctx.drawImage(gameOverImage, 50, 150, 300, 300 );
        clearTimeout(timeoutId);
    }
}

loadImage();
createEnemyWrapper();
setupKeyboardListener()
main();
