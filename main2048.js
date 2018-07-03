var board = new Array();
var score = 0;
var hasConflicted = new Array();
startx=0;
starty=0;
endx=0;
endy=0;
$(document).ready(function(){
    prepareForMobile();
    newgame();
})
function prepareForMobile(){
    if(documentWidth > 500){
        gridContainerWidth=500;
        cellSpace = 20;
        cellSideLength = 100;
    }
    $('#grid-container').css('width',gridContainerWidth-2*cellSpace);
    $('#grid-container').css('height',gridContainerWidth-2*cellSpace);
    $('#grid-container').css('padding',cellSpace);
    $('#grid-container').css('border-radius',0.02*gridContainerWidth);

    $('.grid-cell').css('width',cellSideLength);
    $('.grid-cell').css('height',cellSideLength);
    $('.grid-cell').css('border-radius',0.02*cellSideLength);
}
function newgame(){
    //初始化棋盘格
    init();
    //在随机两个格子生成数字
    generateOneNumber();
    generateOneNumber();
}
function init(){
    for(var i=0;i<4;i++)
        for(var j=0;j<4;j++){
            var gridCell = $("#grid-cell-"+i+"-"+j);
            gridCell.css('top',getPosTop(i,j))
            gridCell.css('left',getPosLeft(i,j))
        }
    for(var i=0;i<4;i++){
        board[i]=new Array();
        hasConflicted[i]=new Array();
        for(var j=0;j<4;j++){
            board[i][j]=0;
            hasConflicted[i][j]=false;
        }
    }
    updateBoardView();
}
function updateBoardView(){
    $(".number-cell").remove();
    for(var i=0;i<4;i++)
        for(var j=0;j<4;j++){
            $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
            var theNumberCell=$('#number-cell-'+i+'-'+j);
            if(board[i][j]==0){
                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
                theNumberCell.css('top',getPosTop(i,j)+cellSideLength/2);
                theNumberCell.css('left',getPosLeft(i,j)+cellSideLength/2);
            }else{
                theNumberCell.css('width',cellSideLength);
                theNumberCell.css('height',cellSideLength);
                theNumberCell.css('top',getPosTop(i,j));
                theNumberCell.css('left',getPosLeft(i,j));
                theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
                theNumberCell.css('color',getNumberColor(board[i][j]));
                theNumberCell.text(board[i][j]);
            }
            hasConflicted[i][j]=false;
        }
    $(".number-cell").css('line-height',cellSideLength+'px');
    $(".number-cell").css('font-size',0.6*cellSideLength+'px');

}
function generateOneNumber(){
    if(nospace(board))
        return false;
    //随机一个位置
    var randx=parseInt(Math.floor(Math.random()*4))//0,1,2,3
    var randy=parseInt(Math.floor(Math.random()*4))//0,1,2,3
    times=0
    while(times<50){
        if(board[randx][randy]==0)
            break;
        randx=parseInt(Math.floor(Math.random()*4))//0,1,2,3
        randy=parseInt(Math.floor(Math.random()*4))//0,1,2,3
        times++;
    }
    if(times==50){
        for(var i=0;i<4;i++)
            for(var j=0;j<4;j++)
                if(board[i][j]==0){
                    randx=i;
                    randy=j;
                }
    }
    //随机一个数字
    var randNumber=Math.random()<0.5?2:4;
    //在随机位置显示随机数字
    board[randx][randy]=randNumber;
    showNumberWithAnimation(randx,randy,randNumber);
    return true;
}

$(document).keydown(function(event){
    
    switch(event.keyCode){
        case 37://left
            event.preventDefault();
            if(moveLeft()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        case 38://up
            event.preventDefault();
            if(moveUp()){
                generateOneNumber();
                isgameover();
            }
            break;
        case 39://right
            event.preventDefault();
            if(moveRight()){
                generateOneNumber();
                isgameover();
            }
            break;
        case 40://down
            event.preventDefault();
            if(moveDown()){
                generateOneNumber();
                isgameover();
            }
            break;
        default:
            break;
    }
});
document.addEventListener("touchstart",function(event){
    startx=event.touches[0].pageX;
    starty=event.touches[0].pageY;
});
document.addEventListener("touchmove",function(event){
    event.preventDefault();
});
document.addEventListener("touchend",function(event){
    endx=event.changedTouches[0].pageX;
    endy=event.changedTouches[0].pageY;

    var deltax=endx-startx;
    var deltay=endy-starty;
    if(Math.abs(deltax)<0.3*documentWidth && Math.abs(deltay)<0.3*documentWidth)
        return;
    //x
    if(Math.abs(deltax)>=Math.abs(deltay)){
        if(deltax>0){
            //right
        }else{
            //left
            if(moveLeft()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
        }
    }
    //y
    else {
        if(deltay>0){
            //down
        }
        else{
            //up
        }
    }
});
function isgameover(){
    if(nospace(board) && nomove(board))
        gameover();
}
function gameover(){
    alert("gameover!")
}
function moveLeft(){
    if(!canMoveLeft(board))
        return false;
    //moveleft
    for(var i=0;i<4;i++)
        for(var j=1;j<4;j++)  {
            if(board[i][j]!=0){
                for(var k=0;k<j;k++){
                    if(board[i][k]==0 && noBlockHorizontal(i,k,j,board)){
                        //move
                        showMoveAnimation(i,j,i,k);
                        board[i][k]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }else if(board[i][k]==board[i][j] && noBlockHorizontal(i,k,j,board) && !hasConflicted[i][k]){
                        //move
                        showMoveAnimation(i,j,i,k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j]=0;
                        hasConflicted[i][k] = true;
                        continue;
                    }
                        
                }
            }
        } 
    setTimeout("updateBoardView()",200);
    return true;
}