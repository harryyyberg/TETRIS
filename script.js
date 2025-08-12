const SHAPES = [
    [
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0]
    ],
    [
        [0,1,0],  
        [0,1,0],  
        [1,1,0]   
    ],
    [
        [0,1,0],
        [0,1,0],
        [0,1,1]
    ],
    [
        [1,1,0],
        [0,1,1],
        [0,0,0]
    ],
    [
        [0,1,1],
        [1,1,0],
        [0,0,0]
    ],
    [
        [1,1,1],
        [0,1,0],
        [0,0,0]
    ],
    [
        [1,1],
        [1,1],
    ]
]

const COLORS = [
    "#000",
    "#9b5fe0",
    "#16a4d8",
    "#60dbe8",
    "#8bd346",
    "#efdf48",
    "#f9a52c",
    "#d64e12"
]

const ROWS = 20;
const COLS = 10;

let scoreboard = document.querySelector("h2")
let score = 0;

let canvas = document.querySelector("#tetris");//like drawing board
let ctx =canvas.getContext("2d");//like drawing pen
ctx.scale(30,30)

let pieceobj=null;
let grid=generategrid();
let time=500;

function generateRandomshape(){
    let ran = Math.floor(Math.random()*7);

    let piece = SHAPES[ran];
    let coloridx = ran+1;

    let x=2;//coordinates
    let y=0;
    return {piece,x,y,coloridx};
}


setInterval(newgamestate,`${time}`);

function newgamestate(){
    checkgrid();
    if(pieceobj == null){
        pieceobj = generateRandomshape();
        renderpiece();
    }
    movedown();
}


function renderpiece(){
    let piece = pieceobj.piece;
    for(let i=0;i<piece.length;i++){
        for(let j=0;j<piece[i].length;j++){
            if(piece[i][j]==1){
                ctx.fillStyle = COLORS[pieceobj.coloridx];
                ctx.fillRect(pieceobj.x+j,pieceobj.y+i,1,1);
            }
        }
    }
}


function movedown(){
    if(!collision(pieceobj.x,pieceobj.y+1))
    pieceobj.y+=1;
    else{
        for(let i=0;i<pieceobj.piece.length;i++){
            for(let j=0;j<pieceobj.piece[i].length;j++){
                if(pieceobj.piece[i][j]==1){
                    let p=pieceobj.x+j;
                    let q=pieceobj.y+i
                    grid[q][p]=pieceobj.coloridx;
                }
            }
        }
        if(pieceobj.y==0) {
            alert("GAME OVER");
            grid=generategrid();
            score=0;
        }
        pieceobj = null;
    }
    rendergrid();//after each line of moving down, the top one gets erased
}

function moveleft(){
    if(!collision(pieceobj.x-1,pieceobj.y)) 
    pieceobj.x-=1;
    rendergrid();
}

function moveright(){
    if(!collision(pieceobj.x+1,pieceobj.y))
    pieceobj.x+=1;
    
    rendergrid();
}


function checkgrid(){
    let count = 0;
    for(let i=0;i<grid.length;i++){
        let allfilled = true;
        for(let j=0;j<grid[i].length;j++){
            if(grid[i][j]==0){
                allfilled = false;
                break;
            }
        }

        if(allfilled){
            count++;
            grid.splice(i,1);           //remove 1 element starting from index i
            grid.unshift([0,0,0,0,0,0,0,0,0,0]);    //add 0's to the start
            i--;
        }
    }
    if(count > 0){
    score += (count < 4 ? count * 10 : 100);    
    }
    scoreboard.innerHTML = "score: " + score;
    if(score <= 50){
        time = 400;
    }
    else if(score <= 100){
        time = 300;
    }
    else if(score <= 200){
        time = 200;
    }
    else{
        time = 150;
    }
}

function rotate(){
    let rotatedpiece=[]
    let piece = pieceobj.piece
    for(let i=0;i<piece.length;i++){
        rotatedpiece.push([])
        for(let j=0;j<piece[i].length;j++){
              rotatedpiece[i].push(0);
        }
    }

    for(let i=0;i<piece.length;i++){
        for(let j=0;j<piece[i].length;j++){
            rotatedpiece[i][j]=piece[j][i]   //transpose
        }
    }

    for(let i=0;i<rotatedpiece.length;i++){
        rotatedpiece[i]=rotatedpiece[i].reverse();
    }

    if(!collision(pieceobj.x,pieceobj.y,rotatedpiece))
        pieceobj.piece=rotatedpiece
    rendergrid()
}

function collision(x,y,rotatedpiece){
    let piece = rotatedpiece || pieceobj.piece;
    for(let i=0;i<piece.length;i++){
        for(let j=0;j<piece[i].length;j++){
            if(piece[i][j]==1){
            let p=x+j; // x=x coordinate, j=column number i.e x cordinate
            let q=y+i;

            if(p>=0 && p<COLS && q>=0 && q<ROWS){
                if(grid[q][p]!=0) return true;
            }

            else{
                return true;
            }
        }
        }
    }
    return false;
}

function generategrid(){
    let grid = [];
    for(let i=0;i<ROWS;i++){
        grid.push([]);
        for(let j=0;j<COLS;j++){
            grid[i].push(0);
        }
    }
    return grid;
}

function rendergrid(){
    for(let i=0;i<grid.length;i++){
        for(let j=0;j<grid[i].length;j++){
            ctx.fillStyle= COLORS[grid[i][j]];
            ctx.fillRect(j,i,1,1)
        }
        renderpiece();  //after erasing top one , bottom another line is created immediately
    }
    
}

document.addEventListener("keydown",function(e){
    let key=e.code;
    if(key == "ArrowDown"){
        movedown();
    }
    else if(key == "ArrowLeft"){
        moveleft();
    }
    else if(key == "ArrowRight"){
        moveright();
    }
    else if(key == "ArrowUp"){
        rotate();
    }
})
