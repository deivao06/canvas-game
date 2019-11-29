var redeNeural = new RedeNeural(2,3,1);
var data = {
    inputs : [
        [0,0],
        [0,1],
        [1,0],
        [1,1],
    ],
    outputs : [
        [0],
        [1],
        [1],
        [0],
    ]
};
var train = true;

requestAnimationFrame(loop);

function loop() {
    if (train){
        for (var i=0; i<10000; i++){
            var index = random(0, data.inputs.length - 1);
            redeNeural.train(data.inputs[index], data.outputs[index]);
        }
        if (redeNeural.predict([1,0])[0] > 0.98 && redeNeural.predict([0,0])[0] < 0.04){
            train = false;
            console.log('terminou');
        }else{
            console.log(redeNeural.predict([1,0])[0], redeNeural.predict([0,0])[0]);
        }
    }
    requestAnimationFrame(loop);
}

function random(min, max, float = false){
    var randomNumber = 0;
    if (float){
        randomNumber = Math.random() * (max - min) + min;
    }else{
        randomNumber = Math.floor(Math.random()*(max-min+1)+min);
    }

    return randomNumber;
}