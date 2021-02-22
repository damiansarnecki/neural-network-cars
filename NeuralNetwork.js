class NeuralNetwork {
    constructor(inputLayerSize, hiddenLayerSize, outputLayerSize) {
        
        this.inputLayerSize = inputLayerSize;
        this.hiddenLayerSize = hiddenLayerSize;
        this.outputLayerSize = outputLayerSize;

        this.inputLayer = math.matrix();
        this.firstWeights = math.matrix();
        this.firstBiases = math.matrix();
        this.hiddenLayer = math.matrix();
        this.secondWeights = math.matrix();
        this.secondBiases = math.matrix();
        this.outputLayer  = math.matrix();

        this.setup(inputLayerSize, hiddenLayerSize, outputLayerSize);
    }

    setup(inputLayerSize, hiddenLayerSize, outputLayerSize) {

        this.firstWeights = this.firstWeights.resize([inputLayerSize, hiddenLayerSize])
        this.firstWeights = this.fillWithRandomValues(this.firstWeights)

        this.firstBiases = this.firstBiases.resize([inputLayerSize, hiddenLayerSize])
        this.firstBiases = this.fillWithRandomValues(this.firstBiases)

        this.secondWeights = this.secondWeights.resize([hiddenLayerSize, outputLayerSize])
        this.secondWeights = this.fillWithRandomValues(this.secondWeights)

        this.secondBiases = this.secondBiases.resize([hiddenLayerSize, outputLayerSize])
        this.secondBiases = this.fillWithRandomValues(this.secondBiases)
    }

    mutate(mutationRate) {
        this.firstWeights =  this.mutateSingleMatrix(this.firstWeights, mutationRate);
        this.secondWeights = this.mutateSingleMatrix(this.secondWeights, mutationRate);
        this.firstBiases = this.mutateSingleMatrix(this.firstBiases, mutationRate);
        this.secondBiases = this.mutateSingleMatrix(this.secondBiases, mutationRate);
    }

    mutateSingleMatrix(layer, mutationRate) {
        let mutated = layer.valueOf();
        for(let i = 0; i < mutated.length; i++)
        {
            for(let j = 0; j < mutated[0].length; j++)
            {
                if(Math.random() < mutationRate/100)
                {
                    mutated[i][j] = Math.random()*2-1;
                }
            }
        }
        return math.matrix(mutated)
    }

    fillWithRandomValues(layer, range = 1) {
        let randomizedLayer = layer;
        randomizedLayer = math.map(randomizedLayer, (value) => {
            return Math.random()*2-1*range
        })
        return randomizedLayer;
    }

    calculateOutput(input) {

        this.inputLayer = math.matrix(input)

        this.hiddenLayer = math.multiply(this.inputLayer, math.add(this.firstWeights, this.firstBiases))
        this.hiddenLayer = math.map(this.hiddenLayer, (value) => {return sigmoid(value)})

        this.outputLayer = math.multiply(this.hiddenLayer, math.add(this.secondWeights, this.secondBiases))
        this.outputLayer = math.map(this.outputLayer, (value) => {return sigmoid(value)})

        return this.outputLayer.valueOf();
    }

    getNeuralNetwork() {
        return {
            firstWeights: this.firstWeights,
            secondWeights: this.secondWeights,
            firstBiases: this.firstBiases,
            secondBiases: this.secondBiases
        }
    }

    setNeuralNetwork(neuralNetwork) {
        this.firstWeights = math.clone(neuralNetwork.firstWeights);
        this.secondWeights = math.clone(neuralNetwork.secondWeights);
        this.firstBiases = math.clone(neuralNetwork.firstBiases);
        this.secondBiases = math.clone(neuralNetwork.secondBiases);
    }

    draw(canvas, ctx) {

        const circleSize = 15;
        ctx.lineWidth = 2;
        ctx.fillStyle = "rgb(255,255,255)"
        ctx.fillRect(0,0, canvas.width, canvas.height)

        let input = this.inputLayer.valueOf();
        let w1 = this.firstWeights.valueOf()
        let hidden = this.hiddenLayer.valueOf();
        let w2 = this.secondWeights.valueOf()
        let output = this.outputLayer.valueOf();

        for(let i = 0; i < w1.length; i++) {
            ctx.beginPath();

            for(let j = 0; j < w1[0].length; j++)
            {
                ctx.moveTo(canvas.width/6, i * canvas.height/input.length + canvas.height/input.length/2)
                if(w1[i][j] < 0.5)
                    ctx.strokeStyle = `rgb(${(w1[i][j])*512}, 0, 0)`
                else 
                    ctx.strokeStyle = `rgb(0, 0,${(w1[i][j])*255})`
                ctx.lineTo(canvas.width/2, j * canvas.height/hidden.length + canvas.height/hidden.length/2);
                
            }
            ctx.stroke();
        }

        for(let i = 0; i < w2.length; i++) {
            ctx.beginPath();

            for(let j = 0; j < w2[0].length; j++)
            {
                ctx.moveTo(canvas.width/2, i * canvas.height/hidden.length + canvas.height/hidden.length/2)
                if(w2[i][j] < 0.5)
                    ctx.strokeStyle = `rgb(${(w2[i][j])*512}, 0, 0)`
                else 
                    ctx.strokeStyle = `rgb(0,0, ${(w2[i][j])*255})`

                ctx.lineTo(canvas.width/6*5, j * canvas.height/output.length + canvas.height/output.length/2);
                
            }
            ctx.stroke();
        }

        ctx.lineWidth = 1;
        for(let i = 0 ; i < input.length; i++)
        {   
            ctx.beginPath();
            ctx.fillStyle = `rgb(${input[i]*255/2},${input[i]*255/2},${input[i]*255})`
            ctx.arc(canvas.width/6, i * canvas.height/input.length + canvas.height/input.length/2, circleSize, 0, Math.PI*2)
            ctx.fill();

            ctx.beginPath();
            ctx.strokeStyle = `black`
            ctx.arc(canvas.width/6, i * canvas.height/input.length + canvas.height/input.length/2, circleSize, 0, Math.PI*2)
            ctx.stroke();
        }

        for(let i = 0 ; i < hidden.length; i++)
        {   
            ctx.beginPath();
            ctx.fillStyle = `rgb(${hidden[i]*255/2},${hidden[i]*255/2},${hidden[i]*255})`
            ctx.arc(canvas.width/2, i * canvas.height/hidden.length + canvas.height/hidden.length/2, circleSize, 0, Math.PI*2)
            ctx.fill();

            ctx.beginPath();
            ctx.strokeStyle = `black`
            ctx.arc(canvas.width/2, i * canvas.height/hidden.length + canvas.height/hidden.length/2, circleSize, 0, Math.PI*2)
            ctx.stroke();
        }

        for(let i = 0 ; i < output.length; i++)
        {   
            ctx.beginPath();
            ctx.fillStyle = `rgb(${output[i]*255/2},${output[i]*255/2},${output[i]*255})`
            ctx.arc(canvas.width/6*5, i * canvas.height/output.length + canvas.height/output.length/2, circleSize, 0, Math.PI*2)
            ctx.fill();

            ctx.beginPath();
            ctx.strokeStyle = `black`
            ctx.arc(canvas.width/6*5, i * canvas.height/output.length + canvas.height/output.length/2, circleSize, 0, Math.PI*2)
            ctx.stroke();
        }
    }
}

function sigmoid(t) {
    return 1/(1+Math.pow(Math.E, -t));
}