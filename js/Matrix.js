class Matrix {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;

        this.data = [];
        for (var i=0; i<rows; i++){
            var arr= [];
            for (var j=0; j<cols; j++){
                arr.push(0)
            }
            this.data.push(arr);
        }
    }

    //FUNÇÕES DIVERSAS

    print(){
        console.table(this.data);
    }

    randomize(){
        this.map((elm, i, j) => {
            return Math.random()*2-1
        });
    }

    map(func){
        this.data = this.data.map((arr, i) => {
            return arr.map((num, j) => {
                return func(num, i, j);
            })
        });

        return this;
    }

    static arrayToMatrix(arr){
        var matrix = new Matrix(arr.length, 1);
        matrix.map((elm,i,j) => {
            return arr[i];
        });
        return matrix;
    }

    static matrixToArray(obj){
        var arr = [];
        obj.map((elm,i,j) => {
            arr.push(elm);
        });
        return arr;
    }

    static map(A, func){
        var matrix = new Matrix(A.rows, A.cols);

        matrix.data = A.data.map((arr, i) => {
            return arr.map((num, j) => {
                return func(num, i, j);
            })
        });

        return matrix;
    }

    static transpose(A){
        var matrix = new Matrix(A.cols, A.rows);
        matrix.map((num,i,j) => {
            return A.data[j][i];
        });
        return matrix;
    }

    //FUNÇÕES ESTATICAS MATRIZ COM ESCALAR

    static escalarMultiply(A, escalar){
        var matrix = new Matrix(A.rows, A.cols);

        matrix.map((num, i, j) =>{
            return A.data[i][j] * escalar
        });

        return matrix;
    }

    //FUNÇÕES ESTATICAS MATRIZ COM MATRIZ

    static add(A, B){
        var matrix = new Matrix(A.rows, A.cols);
        matrix.map((num, i, j) =>{
            return A.data[i][j] + B.data[i][j]
        });

        return matrix;
    }

    static subtract(A, B){
        var matrix = new Matrix(A.rows, A.cols);
        matrix.map((num, i, j) =>{
            return A.data[i][j] - B.data[i][j]
        });

        return matrix;
    }

    static multiply(A, B){
        var matrix = new Matrix(A.rows, B.cols);

        matrix.map((num, i, j) => {
            var sum = 0;

            for(var k=0; k < A.cols; k++){
                var elm1 = A.data[i][k];
                var elm2 = B.data[k][j];

                sum += elm1 * elm2;
            }

            return sum;
        });

        return matrix;
    }

    static hadamard(A, B){
        var matrix = new Matrix(A.rows, A.cols);

        matrix.map((num, i, j) =>{
            return A.data[i][j] * B.data[i][j]
        });

        return matrix;
    }
}