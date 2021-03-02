const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;

let render;
let engine;
let world;


const networkCanvas = document.getElementById("networkCanvas");
const networkCanvasCtx = networkCanvas.getContext("2d");
const followCheckbox = document.getElementById("follow");
const mainContainer = document.getElementById("main")

const populationSizeSlider = document.getElementById("populationSizeSlider")
const mutationRateSlider = document.getElementById("mutationRateSlider")
const speedSlider = document.getElementById("speedSlider")

let currentPopulationCount;
let populationSize;
let generation = 0;
let biggestFitnessEver = 0;
let maxFitness = 0;
let maxFitnessHistory = []
let mutationRate;
let speed;
let fittestCar;

let cars = [];
let checkpoints = []
let walls = [];


function draw() {

    for(let car of cars)
        car.update();

    fittestCar = findFittestCar();
    updateBiggestFitnessThisGen(fittestCar.fitness)
    
    updateCamera();
    drawBestNetwork();

    updatePopulationCounter();
    
    if(currentPopulationCount <= 0)
    {
        updateCharts();
        startGeneration();
    }
}

function updateCamera() {
    let zoom = 0.7;

    if(followCheckbox.checked) {
        Render.lookAt(render, fittestCar.body, {
            x: 240/zoom,
            y: 160/zoom
        });
    } else {
        Render.lookAt(render, {x: mainContainer.getBoundingClientRect().width/2, y: mainContainer.getBoundingClientRect().height/2}, {
            x: mainContainer.getBoundingClientRect().width/2,
            y: mainContainer.getBoundingClientRect().height/2
        });
    }
}

function countAlive() {
    let count = 0;
    for(let c of cars) {
        if(!c.dead)
            count++;
    }
    return count;
}

function startGeneration() {
    updateGenerationCounter();

    currentPopulationCounter = populationSize;

    let fittestCarNeuralNetwork
    if(generation > 1)
        fittestCarNeuralNetwork = fittestCar.neuralNetwork.getNeuralNetwork();
        
    deleteCars();

    for(let i = 0; i < populationSize; i++)
    {
        c = new Car();
        
        if(fittestCarNeuralNetwork){
            c.neuralNetwork.setNeuralNetwork(fittestCarNeuralNetwork)
            if(i > 0)
                c.mutate();
        }
        cars.push(c)
    }
}

function deleteCars() {
    for(let c of cars) {
        Matter.World.remove(world, c.body)
    }
    cars = []
}

function findFittestCar()
{
    let fittestCar;
    maxFitness = 0;

    for(let car of cars)
    {    
        if(car.fitness > maxFitness)
        {
            fittestCar = car;
            maxFitness = car.fitness;
        }
    }

    if(maxFitness > biggestFitnessEver)
        updateBiggestFitnessEver(maxFitness);

    return fittestCar;
}

function setup() {
    createCanvas(0,0)
    applyDefaultConfig();

    setupEngine();
    setupWorld();
    setupRender();

    makeWalls();
    makeCheckpoints();
    startGeneration();
}

function setupWorld() {
    world = engine.world;
    world.gravity.y = 0;
    world.gravity.x = 0;
}

function setupEngine() {
    engine = Engine.create()
    Engine.run(engine)
}

function setupRender() {
    render = Render.create({
        element: document.getElementById("main"),
        engine: engine,
        options: {
            height: mainContainer.getBoundingClientRect().height,
            width: mainContainer.getBoundingClientRect().width,
            wireframes: false,
            background: 'black'
        }
    })

    Render.run(render)
}

function makeWalls() {
    walls = [
        new Wall(40,340, 20, 636),
        new Wall(200, 305, 20, 550),
        new Wall(109, 722, 200, 20, Math.PI/4),
        new Wall(222, 598, 70, 20, Math.PI/4),
        new Wall(356, 580, 120, 20, -Math.PI/4),
        new Wall(356, 430, 120, 20, Math.PI/4),
        new Wall(280, 620, 80, 20),
        new Wall(395, 505, 20, 80),
        new Wall(537, 506, 20, 220),
        new Wall(356, 78, 120, 20, -Math.PI/4),
        new Wall(498, 360, 120, 20, Math.PI/4),
        new Wall(478, 185, 60, 20, -Math.PI/4),
        new Wall(517, 38, 252, 20),
        new Wall(568, 167, 150, 20),
        new Wall(448, 701, 260, 20, -Math.PI/4),
        new Wall(316, 254, 20, 280),
        new Wall(459, 262, 20, 126),
        new Wall(268, 790, 190, 20),
        new Wall(120, 20, 180, 20),
        new Wall(694, 154, 110, 20, Math.PI/1.08),
        new Wall(694, 50, 110, 20, -Math.PI/1.08),
        new Wall(795, 154, 110, 20, -Math.PI/1.08),
        new Wall(795, 50, 110, 20, Math.PI/1.08),
        new Wall(894, 154, 110, 20, Math.PI/1.08),
        new Wall(894, 50, 110, 20, -Math.PI/1.08),
        new Wall(992, 154, 110, 20, -Math.PI/1.08),
        new Wall(992, 50, 110, 20, Math.PI/1.08),
 
    ]
}

function makeCheckpoints() {
    checkpoints = [
        new Checkpoint(120, 300, 140, 20),
        new Checkpoint(120, 450, 140, 20),
        new Checkpoint(153, 648, 149, 20, -Math.PI/4),
        new Checkpoint(280, 704, 20, 148),
        new Checkpoint(394, 648, 131, 20, Math.PI/4),
        new Checkpoint(466, 500, 122, 20),
        new Checkpoint(424, 392, 132, 20, -Math.PI/4),
        new Checkpoint(388, 255, 120, 20),
        new Checkpoint(425, 123, 141, 20, Math.PI/4),
        new Checkpoint(580, 102, 20, 108),
        new Checkpoint(844, 102, 20, 102),
        new Checkpoint(1044, 102, 20, 102, false, true), // finish
    ]
}

function updateCharts() {
    let averageFitness = 0;
    for(let c of cars)
    {
        averageFitness += c.fitness;
    }

    averageFitness = averageFitness/populationSize;

    console.log(averageFitness)

    fitnessPerGenerationChart.data.datasets[0].data.push(maxFitness)
    fitnessPerGenerationChart.data.datasets[1].data.push(averageFitness)
    fitnessPerGenerationChart.data.labels.push(generation)
    fitnessPerGenerationChart.update();
}

function drawBestNetwork() {
    fittestCar.neuralNetwork.draw(networkCanvas, networkCanvasCtx)
}

function updateSpeed(value) {
    document.getElementById('speed').innerHTML = value;
    speed = value;
}

function updateMutationRate(value) {
    document.getElementById('mutationRate').innerHTML = value/100;
    mutationRate = value;
}

function updatePopulationCounter() {
    currentPopulationCount = countAlive()
    document.getElementById("currentPopulation").innerHTML = currentPopulationCount;
}

function updateGenerationCounter() {
    generation++;
    document.getElementById("generationCounter").innerHTML = generation;
}

function updatePopulationSize(value) {
    populationSize = value;
    document.getElementById("populationSize").innerHTML = value;
}

function updateBiggestFitnessEver(value) {
    biggestFitnessEver = value;
    document.getElementById("biggestFitnessEver").innerHTML = Math.floor(biggestFitnessEver);
}

function updateBiggestFitnessThisGen(value) {
    maxFitness = value;
    document.getElementById("biggestFitnessThisGen").innerHTML = Math.floor(maxFitness);
}

window.onresize = function() {
    render.options.width = mainContainer.getBoundingClientRect().width
    render.options.height = mainContainer.getBoundingClientRect().height
}

function applyDefaultConfig() {
    mutationRateSlider.value = defaultConfig.mutationRate
    updateMutationRate(mutationRateSlider.value)

    populationSizeSlider.value = defaultConfig.populationSize;
    updatePopulationSize(populationSizeSlider.value)

    speedSlider.valuee = defaultConfig.speed;
    updateSpeed(speedSlider.value)

}