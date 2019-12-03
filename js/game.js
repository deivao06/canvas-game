var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var canvas2 = document.getElementById("canvas2");
var context2 = canvas2.getContext("2d");

var redeNeural = new RedeNeural(3,5,3);
var train = true;

var trainData = {
    inputs : [
        [1,-1, 15],
        [1,1, 15],
        [1,1, 2],
        [1, -1, 2]
    ],
    outputs : [
        [1, 0, 0], //SUBIR
        [0,1,0], //DESCER
        [0,0,1], //PARAR
        [0,0,1], //PARAR
    ]
};

var game = {
    players : {
        'player1' : {
            w: 15,
            h: 50,
            x: 0,
            y: (canvas.height / 2) - 50,
            speed: 8,
        },
        'player2' : {
            w: 15,
            h: 50,
            x: canvas.width - 15,
            y: (canvas.height / 2) - 50,
            speed: 3,
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
            speed: 3
        },
    }
};

requestAnimationFrame(renderGame);

function renderGame(){
    context.clearRect(0,0,canvas.width, canvas.height);
    context2.clearRect(0,0,canvas2.width, canvas2.height);

    if (train){
        //REDE NEURAL
        for (var i=0; i< 10000; i++){
            var index = random(0, trainData.inputs.length - 1);
            redeNeural.train(trainData.inputs[index], trainData.outputs[index]);
        }

        if (redeNeural.predict([1,-1, 15])[0] > 0.98 && redeNeural.predict([1, -1, 2])[2] > 0.98) {
            train = false;
            console.log('TREINOU');
        }else{
            console.log(redeNeural.predict([1,-1, 15])[0], redeNeural.predict([1, -1, 2])[2])
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

        var player2 = game.players['player2'];
        if (movePlayer2(player2, ball) === 'subir'){
            player2.y -= player2.speed;
        }else if (movePlayer2(player2, ball) === 'descer'){
            player2.y += player2.speed;
        }else if (movePlayer2(player2, ball) === 'parar'){
            player2.y += 0;
        };
    }

    requestAnimationFrame(renderGame);
}

function checkBallColision(ball){
    var player1 = game.players['player1'];
    var player2 = game.players['player2'];

    if (ball.x >= player1.x && ball.x <= player1.x + player1.w && ball.y >= player1.y && ball.y <= player1.y + player1.h){
        ball.orientationX = 1;
    }

    if (ball.x + ball.w >= player2.x && ball.x + ball.w <= player2.x + player2.w && ball.y >= player2.y && ball.y <= player2.y + player2.h){
        ball.orientationX = -1;
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
    ball.orientationX = Math.pow(2, Math.floor( Math.random() * 2 )+1) - 3;
    ball.orientationY = Math.pow(2, Math.floor( Math.random() * 2 )+1) - 3;
}

function movePlayer2(player2, ball){
    var dx = player2.x - ball.x;
    var dy = player2.y - ball.y;
    var distance = Math.sqrt(dx ** 2 + dy **2);

    var redeNeuralOutput = redeNeural.predict([ball.orientationX, ball.orientationY, distance]);

    var subir = redeNeuralOutput[0];
    var descer = redeNeuralOutput[1];
    var parar = redeNeuralOutput[2];

    if (subir && !descer && !parar && player2.y > 0){
        return 'subir';
    }else if(!subir && descer && !parar && player2.y + player2.h < canvas.width){
        return 'descer';
    }else if(!subir && !descer && parar){
        return 'parar';
    }
}

document.addEventListener("keydown", function (event) {
    var player = game.players['player1'];

    switch (event.which) {
        case 38:
            if (player.y > 0){
                player.y -= player.speed;
            }
            break;
        case 40:
            if (player.y < canvas.height - player.h){
                player.y += player.speed;
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
