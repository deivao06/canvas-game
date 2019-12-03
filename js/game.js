var canvas = document.getElementById("canvas");
var canvas2 = document.getElementById("canvas2");
var context = canvas.getContext("2d");
var context2 = canvas2.getContext("2d");

var redeNeural = new RedeNeural(3,5,3);

var data = {
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
            speed: 0.2
        },
    }
};

requestAnimationFrame(renderGame);

function renderGame(){
    context.clearRect(0,0,canvas.width, canvas.height);
    context2.clearRect(0,0,canvas2.width, canvas2.height);

    if (train){
        for (var i=0; i<10000; i++){
            var index = random(0, data.inputs.length - 1);
            redeNeural.train(data.inputs[index], data.outputs[index]);
        }
        if (redeNeural.predict([1,-1, 15])[0] > 0.98 && redeNeural.predict([1, -1, 2])[2] > 0.98) {
            train = false;
            console.log('terminou');
        }else{
            console.log(redeNeural.predict([1,-1, 15])[0], redeNeural.predict([1, -1, 2])[2])
        }
    }

    if (!train){
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

        var player2 = game.players['player2'];
        var dx = player2.x - ball.x;
        var dy = player2.y - ball.y;
        var redePredict = redeNeural.predict([ball.orientationX, ball.orientationY, Math.sqrt(dx ** 2 + dy ** 2)]);
        var subir = Math.round(redePredict[0]);
        var descer = Math.round(redePredict[1]);
        var parar = Math.round(redePredict[2]);

        if (subir == 1 && descer == 0 && parar == 0 && player2.y > 0){
            player2.y -= player2.speed;
        }else if(subir == 0 && descer == 1 && parar == 0 && player2.y < canvas.height - player2.h){
            player2.y += player2.speed;
        }else if (subir == 0 && descer == 0 && parar == 1) {
            player2.y += 0;
        }

        for (var i=0; i<redeNeural.i_nodes; i++){
            context2.fillStyle = 'green';
            context2.fillRect(0, 100*i + 100, 30,30);
        }

        for (var i=0; i<redeNeural.h_nodes; i++){
            context2.fillStyle = 'blue';
            context2.fillRect(150, 50*i + 100, 30,30);
        }

        for (var i=0; i<redeNeural.o_nodes; i++){
            if (subir == 1){
                if (i==0){
                    context2.fillStyle = 'red';
                }else{
                    context2.fillStyle = 'black';
                }
            }else if (descer == 1){
                if (i==1){
                    context2.fillStyle = 'red';
                }else{
                    context2.fillStyle = 'black';
                }
            }else if (parar == 1){
                if (i==2){
                    context2.fillStyle = 'red';
                }else{
                    context2.fillStyle = 'black';
                }
            }
            context2.fillRect(300, 100*i + 100, 30,30);
        }

        context2.font = "20px Arial";
        context2.fillStyle = 'black';
        context2.fillText(subir, 0, 25);
        context2.fillText(descer, 20, 25);
        context2.fillText(parar, 40, 25);

        checkBallColision(ball);
    }

    requestAnimationFrame(renderGame);

}

function checkBallColision(ball){
    var player1 = game.players['player1'];
    var player2 = game.players['player2'];

    if (ball.x >= player1.x && ball.x <= player1.x + player1.w && ball.y >= player1.y && ball.y <= player1.y + player1.h){
        ball.orientationX = 1;
    }
    if (ball.x >= player2.x && ball.x <= player2.x + player2.w && ball.y >= player2.y && ball.y <= player2.y + player2.h){
        ball.orientationX = -1;
    }
    if (ball.x > canvas.width || ball.x < 0){
        ball.x = (canvas.width / 2) - 2;
        ball.y = (canvas.height / 2) - 2;
        ball.orientationX = Math.pow(2, Math.floor( Math.random() * 2 )+1) - 3;
        ball.orientationY = Math.pow(2, Math.floor( Math.random() * 2 )+1) - 3;
        if (!train){
            train = true;
        }
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
