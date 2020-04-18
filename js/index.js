var over = false;
var me = true; //我

var chressBord = []; //棋盘
for (var i = 0; i < 15; i++) {
    chressBord[i] = [];
    for (var j = 0; j < 15; j++) {
        chressBord[i][j] = 0;
    }
}

//赢法的统计数组
var blackWin = [];
var whiteWin = [];

//赢法数组
var wins = [];
for (var i = 0; i < 15; i++) {
    wins[i] = [];
    for (var j = 0; j < 15; j++) {
        wins[i][j] = [];
    }
}

var count = 0; //赢法总数
//横线赢法
for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[i][j + k][count] = true;
        }
        count++;
    }
}

//竖线赢法
for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[j + k][i][count] = true;
        }
        count++;
    }
}

//正斜线赢法
for (var i = 0; i < 11; i++) {
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[i + k][j + k][count] = true;
        }
        count++;
    }
}

//反斜线赢法
for (var i = 0; i < 11; i++) {
    for (var j = 14; j > 3; j--) {
        for (var k = 0; k < 5; k++) {
            wins[i + k][j - k][count] = true;
        }
        count++;
    }
}

for (var i = 0; i < count; i++) {
    blackWin[i] = 0;
    whiteWin[i] = 0;
}

var chess = document.getElementById("chess");
var context = chess.getContext('2d');
context.strokeStyle = '#bfbfbf'; //边框颜色

// 绘画棋盘
var drawChessBoard = function () {

    for (var i = 0; i < 15; i++) {
        context.moveTo(15 + i * 30, 15);
        context.lineTo(15 + i * 30, 435);
        context.stroke();
        context.moveTo(15, 15 + i * 30);
        context.lineTo(435, 15 + i * 30);
        context.stroke();
    }
}
drawChessBoard();

function isLightBackground(id, isLight) {
    var $this = document.getElementById(id);
    if (isLight) {
        $this.style.backgroundColor = "#45c01a";
    } else {
        $this.style.backgroundColor = "#b9b9b9";
    }

}
var i, j;
chess.onclick = function (e) {
    if (over) {
        return;
    }
    var x = e.offsetX;
    var y = e.offsetY;
    i = Math.floor(x / 30);
    j = Math.floor(y / 30);
    if (me) {
        if (chressBord[i][j] == 0) {
            oneStep(i, j, true);
            chressBord[i][j] = 1; //黑子
            for (var k = 0; k < count; k++) {
                if (wins[i][j][k]) {

                    blackWin[k]++;
                    whiteWin[k] = 6; //这个位置对方不可能赢了
                    if (blackWin[k] == 5) {
                        window.alert('黑子赢了');
                        over = true;
                        isLightBackground('revert', false);
                        isLightBackground('removeRevert', false);
                        break;
                    }
                }
            }

        }
    } else {
        if (chressBord[i][j] == 0) {
            oneStep(i, j, false);
            chressBord[i][j] = 2; //白子
            for (var k = 0; k < count; k++) {
                if (wins[i][j][k]) {
                    whiteWin[k]++;
                    blackWin[k] = 6;
                    if (whiteWin[k] == 5) {
                        window.alert('白子赢了');
                        over = true;
                        isLightBackground('revert', false);
                        isLightBackground('removeRevert', false);
                        break;
                    }
                }
            }
        }
    }
    if (!over) {
        me = !me;
        //悔棋的样式点亮
        isLightBackground('revert', true);
    }

}

var revertFlag = false;
//悔棋事件
function revert() {
    if (!over && !revertFlag) {
        context.clearRect(i * 30, j * 30, 30, 30);
        chressBord[i][j] = 0;
        if (!me) {
            for (var k = 0; k < count; k++) {
                if (wins[i][j][k]) {
                    blackWin[k]--;
                }
            }
        } else {
            for (var k = 0; k < count; k++) {
                if (wins[i][j][k]) {
                    whiteWin[k]--;
                }
            }
        }
        me = !me;
        revertFlag = true;
        //撤销悔棋的样式点亮，悔棋样式disabled
        isLightBackground('revert', false);
        isLightBackground('removeRevert', true);
    }
}

//撤销悔棋事件
function removeRevert() {
    if (!over && revertFlag) {
        if (me) {
            if (chressBord[i][j] == 0) {
                oneStep(i, j, true);
                chressBord[i][j] = 1; //黑子
                for (var k = 0; k < count; k++) {
                    if (wins[i][j][k]) {
                        blackWin[k]++;
                    }
                }

            }
        } else {
            if (chressBord[i][j] == 0) {
                oneStep(i, j, false);
                chressBord[i][j] = 2; //白子
                for (var k = 0; k < count; k++) {
                    if (wins[i][j][k]) {
                        whiteWin[k]++;
                    }
                }
            }
        }
        if (!over) {
            me = !me;
        }
        revertFlag = false;

        //悔棋的样式点亮，撤销悔棋样式disabled
        isLightBackground('revert', true);
        isLightBackground('removeRevert', false);
    }
}

//画棋子
var oneStep = function (i, j, me) {
    context.beginPath();
    context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI); //画圆
    context.closePath();
    //渐变
    var gradient = context.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 13, 15 + i * 30 + 2, 15 + j *
        30 - 2, 0);

    if (me) {
        gradient.addColorStop(0, '#0a0a0a');
        gradient.addColorStop(1, '#636766');
    } else {
        gradient.addColorStop(0, '#d1d1d1');
        gradient.addColorStop(1, '#f9f9f9');
    }
    context.fillStyle = gradient;
    context.fill();
    return true;
}

document.getElementById("restart").onclick = function () {
    window.location.reload();
}