var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var canvas2 = document.getElementById("canvas2");
var context2 = canvas2.getContext("2d");

var redeNeural = new RedeNeural(3,5,1);
var train = true;

var trainData = {
    inputs : [
        [1,-1,2],
        [1,1,2],
        [-1,-1,2],
        [1,1,10],
        [1,-1,10],
        [-1,-1,10],
    ],
    outputs : [
        [1], //ALINHAR
        [1], //ALINHAR
        [1], //ALINHAR
        [0], //CENTRALIZAR
        [0], //CENTRALIZAR
        [0], //CENTRALIZAR
    ]
};

var game = {
    players : {
        'player1' : {
            w: 15,
            h: 50,
            x: 0,
            y: (canvas.height / 2) - 50,
            speed: 10,
        },
        'player2' : {
            w: 15,
            h: 50,
            x: canvas.width - 15,
            y: (canvas.height / 2) - 50,
            speed: 8,
        }
    },

    balls : {
        'ball1' : {
            w: 15,
            h: 15,
            x: (canvas.width / 2),
            y: (canvas.height / 2) - 30,
            orientationX: Math.pow(2, Math.floor( Math.random() * 2 )+1) - 3,
            orientationY: Math.pow(2, Math.floor( Math.random() * 2 )+1) - 3,
            speed: 2.2
        },
    },
};

requestAnimationFrame(renderGame);

function renderGame(){
    context.clearRect(0,0,canvas.width, canvas.height);
    context2.clearRect(0,0,canvas2.width, canvas2.height);

    if (train){
        //REDE NEURAL
        context2.font = "30px Arial";
        context2.fillText("TREINANDO...", 10, 50);

        for (var i=0; i< 10000; i++){
            var index = random(0, trainData.inputs.length - 1);
            redeNeural.train(trainData.inputs[index], trainData.outputs[index]);
        }

        if (redeNeural.predict([1,-1, 2])[0] > 0.98 && redeNeural.predict([1,-1, 10])[0] < 0.04) {
            train = false;
            console.log('TREINOU');
        }
    }else{
        //BALL
        var ball = game.balls['ball1'];
        context.fillStyle = "red";
        context.fillRect(ball.x, ball.y, ball.w, ball.h);

        //MOVE BALL
        ball.x += ball.orientationX * ball.speed;
        ball.y += ball.orientationY * ball.speed;
        checkBallColision(ball);

        //PLAYERS
        for (var playerId in game.players){
            var player = game.players[playerId];
            context.fillStyle = "black";
            context.fillRect(player.x, player.y, player.w, player.h);
        }

        //MOVE PLAYER2
        var player2 = game.players['player2'];
        var redeNeuralOutput = movePlayer(player2, ball);

        //DRAW NEURAL NETWORK
        for (var i=0; i< redeNeural.o_nodes; i++){
            if (redeNeuralOutput){
                context2.fillStyle = "red";
                context2.font = "30px Arial";
                context2.fillText("ALINHAR", 40,175);
            }else{
                context2.fillStyle = "black";
                context2.font = "30px Arial";
                context2.fillText("CENTRALIZAR", 40,175);
            }
            context2.fillRect(0,150,30,30);
        }
    }

    requestAnimationFrame(renderGame);
}

function checkBallColision(ball){
    var player1 = game.players['player1'];
    var player2 = game.players['player2'];

    if (ball.x >= player1.x && ball.x <= player1.x + player1.w && ball.y >= player1.y && ball.y <= player1.y + player1.h){
        ball.orientationX = 1;
        ball.orientationY = random(-1,1);
    }

    if (ball.x + ball.w >= player2.x && ball.x + ball.w <= player2.x + player2.w && ball.y >= player2.y && ball.y <= player2.y + player2.h){
        ball.orientationX = -1;
        ball.orientationY = random(-1,1);
    }

    if (ball.x > canvas.width || ball.x + ball.w < 0){
        resetBallPosition(ball);
    }

    if(ball.y + ball.h >= canvas.height || ball.y <= 0) {
        ball.orientationY *= -1
    }
}

function resetBallPosition(ball){
    ball.x = (canvas.width / 2);
    ball.y = (canvas.height / 2) - 30;
    ball.orientationX = 0;
    ball.orientationY = 0;
}

function movePlayer(player, ball){
    var dx = player.x - ball.x;

    var centro = canvas.width / 2;

    var redeNeuralOutput = Math.round(redeNeural.predict([ball.orientationX, ball.orientationY, dx/10])[0]);
    if (redeNeuralOutput){
        if (player.y > ball.y && player.y > 0){
            player.y -= player.speed;
        }else if (player.y < ball.y && player.y + player.h < canvas.height){
            player.y += player.speed;
        }
    }else{
        if (player.y >= centro){
            player.y -= player.speed;
            if (player.y < centro){
                player.y = centro
            }
        }else{
            player.y += player.speed;
        }
    }

    return redeNeuralOutput;
}

document.addEventListener("keydown", function (event) {
    var player = game.players['player1'];
    var ball = game.balls['ball1'];

    switch (event.which) {
        case 38:
            if (player.y > 0){
                player.y -= player.speed;
            }
            if (ball.orientationX == 0 && ball.orientationY == 0){
                ball.orientationX = -1
                ball.orientationY = -1
            }
            break;
        case 40:
            if (player.y < canvas.height - player.h){
                player.y += player.speed;
            }
            if (ball.orientationX == 0 && ball.orientationY == 0){
                ball.orientationX = -1
                ball.orientationY = 1
            }
            break;
        default:
            console.log('Not a command key');
    }
});

function random(min, max, float = false){
    var randomNumber = 0;
    if (float){
        randomNumber = Math.random() * (max - min) + min;
    }else{
        randomNumber = Math.floor(Math.random()*(max-min+1)+min);
    }

    return randomNumber;
}
