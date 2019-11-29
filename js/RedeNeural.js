class RedeNeural {

    constructor(i_nodes, h_nodes, o_nodes) {
        this.i_nodes = i_nodes;
        this.h_nodes = h_nodes;
        this.o_nodes = o_nodes;

        this.bias_ih = new Matrix(this.h_nodes, 1);
        this.bias_ih.randomize();

        this.bias_ho = new Matrix(this.o_nodes, 1);
        this.bias_ho.randomize();

        this.weigths_ih = new Matrix(this.h_nodes, this.i_nodes);
        this.weigths_ih.randomize();

        this.weigths_ho = new Matrix(this.o_nodes, this.h_nodes);
        this.weigths_ho.randomize();

        this.learning_rate = 0.1;
    }

    train(arr, target){
        // FEEDFOWARD

        // INPUT -> HIDDEN
        var input = Matrix.arrayToMatrix(arr);

        var hidden = Matrix.multiply(this.weigths_ih, input);
        hidden = Matrix.add(hidden, this.bias_ih);
        hidden.map(sigmoid);

        //HIDDEN -> OUTPUT
        var output = Matrix.multiply(this.weigths_ho, hidden);
        output = Matrix.add(output, this.bias_ho);
        output.map(sigmoid);

        // BACKPROPAGATION

        //OUTPUT -> HIDDEN
        var expected = Matrix.arrayToMatrix(target);
        var output_error = Matrix.subtract(expected, output);
        var d_output = Matrix.map(output, dsigmoid);
        var hidden_t = Matrix.transpose(hidden);

        var gradient = Matrix.hadamard(output_error, d_output);
        gradient = Matrix.escalarMultiply(gradient, this.learning_rate);

        //ADJUST BIAS O->H
        this.bias_ho = Matrix.add(this.bias_ho, gradient);
        //ADJUST WEIGTHS O->H
        var weigths_ho_deltas = Matrix.multiply(gradient, hidden_t);
        this.weigths_ho = Matrix.add(this.weigths_ho, weigths_ho_deltas);

        //HIDDEN -> INPUT
        var weigths_ho_t = Matrix.transpose(this.weigths_ho);
        var hidden_error = Matrix.multiply(weigths_ho_t, output_error);
        var d_hidden = Matrix.map(hidden, dsigmoid);
        var input_t = Matrix.transpose(input);

        var gradient_h = Matrix.hadamard(hidden_error, d_hidden);
        gradient_h = Matrix.escalarMultiply(gradient_h, this.learning_rate);

        //ADJUST BIAS H->I
        this.bias_ih = Matrix.add(this.bias_ih, gradient_h);
        //ADJUST WEIGTHS H->I
        var weigths_ih_deltas = Matrix.multiply(gradient_h, input_t);
        this.weigths_ih = Matrix.add(this.weigths_ih, weigths_ih_deltas);
    }

    predict(arr){
        // FEEDFOWARD

        // INPUT -> HIDDEN
        var input = Matrix.arrayToMatrix(arr);

        var hidden = Matrix.multiply(this.weigths_ih, input);
        hidden = Matrix.add(hidden, this.bias_ih);
        hidden.map(sigmoid);

        //HIDDEN -> OUTPUT
        var output = Matrix.multiply(this.weigths_ho, hidden);
        output = Matrix.add(output, this.bias_ho);
        output.map(sigmoid);
        output = Matrix.matrixToArray(output);

        return output;
    }
}

function sigmoid(x) {
    return 1/(1+Math.exp(-x));
}

function dsigmoid(x){
    return x * (1-x);
}