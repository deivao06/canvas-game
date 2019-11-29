var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var redeNeural = new RedeNeural(2,3,1);
var data = {
    inputs : [
        [-1,-1],
        [-1,1]
    ],
    outputs : [
        [1], //SUBIR
        [0], //DESCER
    ]
};
var train = true;

var game = {
    players : {
        'player1' : {
            w: 1,
            h: 3,
            x: 0,
            y: (canvas.height / 2) - 3,
            speed: 1,
        },
        'player2' : {
            w: 1,
            h: 3,
            x: canvas.width - 1,
            y: (canvas.height / 2) - 3,
            speed: 1,
        }
    },

    balls : {
        'ball1' : {
            w: 1,
            h: 1,
            x: (canvas.width / 2) - 2,
            y: (canvas.height / 2)- 2,
            orientationX: Math.pow(2, Math.floor( Math.random() * 2 )+1) - 3,
            orientationY: Math.pow(2, Math.floor( Math.random() * 2 )+1) - 3,
            speed: 0.5
        },
    }
};

requestAnimationFrame(renderGame);

function renderGame(){
    context.clearRect(0,0,canvas.width, canvas.height);

    if (train){
        for (var i=0; i<10000; i++){
            var index = random(0, data.inputs.length - 1);
            redeNeural.train(data.inputs[index], data.outputs[index]);
        }
        if (redeNeural.predict([-1,-1])[0] > 0.98 && redeNeural.predict([-1,1])[0] < 0.04) {
            train = false;
            console.log('terminou');
        }
    }

    var ball = game.balls['ball1'];
    context.fillStyle = 'red';
    context.fillRect(ball.x, ball.y, ball.w ,ball.h);

    for (var playerId in game.players){
        var player = game.players[playerId];

        context.fillStyle = 'black';
        context.fillRect(player.x, player.y, player.w ,player.h);
    }

    ball.x += ball.orientationX * ball.speed;
    ball.y += ball.orientationY * ball.speed;

    checkBallColision(ball);

    var player2move = Math.round(redeNeural.predict([ball.orientationX, ball.orientationY])[0]);
    if (player2move && game.players['player2'].y > 0){
        game.players['player2'].y -= game.players['player2'].speed;
    }else if (!player2move && game.players['player2'].y + game.players['player2'].h  < canvas.height){
        game.players['player2'].y += game.players['player2'].speed;
    }
    requestAnimationFrame(renderGame);
}

function checkBallColision(ball){
    var player1 = game.players['player1'];
    var player2 = game.players['player2'];

    if (ball.x <= player1.x + player1.w && ball.y >= player1.y && ball.y <= player1.y + player1.h){
        ball.orientationX = 1;
    }
    if (ball.x >= player2.x - player2.w && ball.y >= player2.y && ball.y <= player2.y + player2.h){
        ball.orientationX = -1;
    }
    if(ball.y + ball.h >= canvas.height || ball.y <= 0) {
        ball.orientationY *= -1
    }
}


document.addEventListener("keydown", function (event) {
    var player = game.players['player1'];

    switch (event.which) {
        case 38:
            console.log('Moving Up');
            if (player.y > 0){
                player.y -= player.speed;
            }
            break;
        case 40:
            console.log('Moving Down');
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
