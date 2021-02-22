const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;

let render;
let engine;
let cars = [];
let walls;
let checkpoints;

const canvas = document.getElementById("network");

const ctx = canvas.getContext("2d");
ctx.translate(0.5, 0.5);


let wallBodies = []
let currentPopulation;
let populationSize;
let generation = 0;
let biggestFitnessEver = 0;
let maxFitness = 0;
let mutationRate = 10;
let speed = 1;
let maxFitnessHistory = []

function draw() {

    for(let car of cars)
    {
        car.update();
    }
    updateData();
    drawBestNetwork();
    currentPopulation = countAlive()
    if(currentPopulation <= 0)
    {
        updateCharts();
        startGeneration();
    }
}

function updateMutationRate(value) {
    document.getElementById('mutationRate').innerHTML = value/100;
    mutationRate = value;
}

function countAlive() {
    let count = 0;
    for(let c of cars) {
        if(!c.dead)
            count++;
    }
    return count;
}

function updateSpeed(value) {
    document.getElementById('speed').innerHTML = value;
    speed = value;
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

function startGeneration() {
    updateGeneration();
    populationSize = document.getElementById("populationSizeSlider").value;
    currentPopulation = populationSize;

    let fittestCarNeuralNetwork
    if(generation > 1)
    {
        console.log(findFittestCar());
        fittestCarNeuralNetwork = findFittestCar().neuralNetwork.getNeuralNetwork();
    }
        

    deleteCars();


    for(let i = 0; i < populationSize; i++)
    {
        c = new Car(120,50, 20, 40);
        
        if(fittestCarNeuralNetwork){
            c.neuralNetwork.setNeuralNetwork(fittestCarNeuralNetwork)
            if(i > 0)
                c.mutate();
        }
            
        cars.push(c)
    }
}

function updateGeneration() {
    generation++;


}

function updateData() {
    document.getElementById("generationCounter").innerHTML = generation;
    document.getElementById("currentPopulation").innerHTML = currentPopulation;
    document.getElementById("biggestFitnessThisGen").innerHTML = Math.floor(maxFitness);
    document.getElementById("biggestFitnessEver").innerHTML = Math.floor(biggestFitnessEver);
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
        biggestFitnessEver = maxFitness;

    return fittestCar;
}

function setup() {
    createCanvas(0,0)

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
            height: 800,
            width: 1200,
            wireframes: false,
            background: 'rgb(0,0,0)'
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

class Car {
    constructor(x,y,width,height) {
        this.body = Bodies.rectangle(x,y,width,height, {frictionAir: 0.7, friction:0.3, restitution: 0.6, isSensor: true});

        this.width = width;
        this.height = height;
        this.throttle = 2;
        this.turning = 1;
        this.turningSpeed = 0.15;
        this.dead = false;
        this.friction = 0.55;

        this.distanceLeft = 0;
        this.distanceDiagLeft = 0;
        this.distanceRight = 0;
        this.distanceDiagRight = 0;
        this.distanceCenter = 0;



        this.velX = 0;
        this.velY = 0;

        this.timeSinceLastCheckpoint = 0;
        this.checkpointsPassed = []
        this.fitness = Math.random();

        this.neuralNetwork = new NeuralNetwork(5,4,2)

        World.add(world, this.body)
    }

    mutate() {
        this.neuralNetwork.mutate(mutationRate)
    }

    checkDistances()
    {
        let angle = this.body.angle + Math.PI/2;
        let carX = this.body.position.x;
        let carY = this.body.position.y;
        let range = 150;

        let rFront = raycast(wallBodies, {x: carX, y: carY}, {x: carX +Math.cos(angle)*range, y: carY + Math.sin(angle)*range});
        let rLeft = raycast(wallBodies, {x: carX, y: carY}, {x: carX +Math.cos(angle+Math.PI/2)*range, y: carY + Math.sin(angle+Math.PI/2)*range});
        let rRight = raycast(wallBodies, {x: carX, y: carY}, {x: carX +Math.cos(angle-Math.PI/2)*range, y: carY + Math.sin(angle-Math.PI/2)*range});
        let rDiagLeft = raycast(wallBodies, {x: carX, y: carY}, {x: carX +Math.cos(angle+Math.PI/4)*range, y: carY + Math.sin(angle+Math.PI/4)*range});
        let rDiagRight = raycast(wallBodies, {x: carX, y: carY}, {x: carX +Math.cos(angle-Math.PI/4)*range, y: carY + Math.sin(angle-Math.PI/4)*range});

        if(rLeft[0])
           this.distanceLeft = (map(Math.hypot(carX - rLeft[0].point.x, carY - rLeft[0].point.y), 0, range, 0, 1))
        else
           this.distanceLeft = 1;
        
        if(rDiagRight[0])
           this.distanceDiagRight = (map(Math.hypot(carX - rDiagRight[0].point.x, carY - rDiagRight[0].point.y), 0, range, 0, 1))
        else
           this.distanceDiagRight = 1;

        if(rDiagLeft[0])
           this.distanceDiagLeft = (map(Math.hypot(carX - rDiagLeft[0].point.x, carY - rDiagLeft[0].point.y), 0, range, 0, 1))
        else
           this.distanceDiagLeft = 1;

        if(rRight[0])
           this.distanceRight = (map(Math.hypot(carX - rRight[0].point.x, carY - rRight[0].point.y), 0, range, 0, 1))
        else
           this.distanceRight = 1;

        if(rFront[0])
            this.distanceCenter = (map(Math.hypot(carX - rFront[0].point.x, carY - rFront[0].point.y), 0, range, 0, 1))
        else
             this.distanceCenter = 1;
            
    }

    update() {
        this.body.render.fillStyle = `rgb(0,0,0)`
        if(this.fitness == maxFitness){
            this.body.render.strokeStyle = `rgb(0,255,0)`
            this.body.render.lineWidth = 7;
        }
        else 
        {
            this.body.render.lineWidth = 1;
            this.body.render.strokeStyle = `rgb(255,255,255)`
        }
            
            
        if(this.dead)
            return;

        this.collisionWithCheckpoint()

        this.velX = this.velX*this.friction;
        this.velY = this.velY*this.friction;

        this.checkDistances();

        let output = this.neuralNetwork.calculateOutput([this.distanceLeft, this.distanceDiagLeft, this.distanceCenter, this.distanceDiagRight, this.distanceRight]);

        if(this.collidesWithWall())
        {
            this.dead = true;
            this.isStatic = true;
            this.velX = 0;
            this.velY = 0;
        }


        this.throttle = output[1]*2;

        let angle = this.body.angle;
        this.turning = output[0]*2 - 1;
        let newAngle =  angle + this.turning*this.turningSpeed*speed;
        Matter.Body.setAngle(this.body, newAngle)

        this.velX += Math.sin(-angle)*(1+this.throttle);
        this.velY += Math.cos(-angle)*(1+this.throttle)

        if(this.velX > 5) this.velX = 5;
        if(this.velX < -5) this.velX = -5;
        if(this.velY > 5) this.velY = 5;
        if(this.velY < -5) this.velY = -5;

        Matter.Body.setPosition(this.body, {x: this.body.position.x + this.velX*speed, y: this.body.position.y + this.velY*speed})
    }

    collisionWithCheckpoint() {

        let checkpointBasePoints = 300;
        this.timeSinceLastCheckpoint++;

        for(let checkpoint of checkpoints) {
            if(Matter.SAT.collides(this.body, checkpoint.body).collided && !this.checkpointsPassed.includes(checkpoint))
            {
                this.fitness += checkpointBasePoints - this.timeSinceLastCheckpoint;
                this.checkpointsPassed.push(checkpoint)
                this.timeSinceLastCheckpoint = 0;

                if(checkpoint.finish) {
                    this.fitness += checkpointBasePoints;
                    this.dead = true;
                }

            }
        }

    }

    collidesWithWall() {
        for(let wall of walls) {
            if(Matter.SAT.collides(this.body, wall.body).collided)
            {
                return true;
            }
        }
        return false;
    }

}

class Wall {
    constructor(x,y,width,height, angle) {
        this.body = Bodies.rectangle(x,y,width,height, {isSensor: true, isRigid: true});
        this.body.render.fillStyle = "rgb(230,230,230)";

        this.width = width;
        this.height = height;

        if(angle)
            Matter.Body.setAngle(this.body, angle)

        World.add(world, this.body)
        wallBodies.push(this.body)
    }
}

class Checkpoint {
    constructor(x,y,width,height, angle, finish = false) {
        this.body = Bodies.rectangle(x,y,width,height, {frictionAir: 1, friction:0.3, isSensor: true, isRigid: true});
        this.body.render.fillStyle = "rgb(0,170,250, 0.3)";

        
        if(finish)
            this.body.render.fillStyle = "rgb(250,20,0, 0.3)";

        this.finish = finish
        this.width = width;
        this.height = height;

        if(angle)
            Matter.Body.setAngle(this.body, angle)

        World.add(world, this.body)

    }
}

function drawBestNetwork() {
    findFittestCar().neuralNetwork.draw(canvas, ctx)
}