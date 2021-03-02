class Car {
    constructor() {

        this.width = 20;
        this.height = 40;

        this.body = Bodies.rectangle(120,50, this.width, this.height, {frictionAir: 0.7, friction:0.3, restitution: 0.6, isSensor: true});

        this.throttle = 2;
        this.turning = 1;
        this.turningSpeed = 0.15;
        this.dead = false;
        this.friction = 0.65;

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

        let rFront = raycast(Wall.bodies, {x: carX, y: carY}, {x: carX +Math.cos(angle)*range, y: carY + Math.sin(angle)*range});
        let rLeft = raycast(Wall.bodies, {x: carX, y: carY}, {x: carX +Math.cos(angle+Math.PI/2)*range, y: carY + Math.sin(angle+Math.PI/2)*range});
        let rRight = raycast(Wall.bodies, {x: carX, y: carY}, {x: carX +Math.cos(angle-Math.PI/2)*range, y: carY + Math.sin(angle-Math.PI/2)*range});
        let rDiagLeft = raycast(Wall.bodies, {x: carX, y: carY}, {x: carX +Math.cos(angle+Math.PI/4)*range, y: carY + Math.sin(angle+Math.PI/4)*range});
        let rDiagRight = raycast(Wall.bodies, {x: carX, y: carY}, {x: carX +Math.cos(angle-Math.PI/4)*range, y: carY + Math.sin(angle-Math.PI/4)*range});

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



        if(this.collidesWithWall())
        {
            this.dead = true;
            this.isStatic = true;
            this.velX = 0;
            this.velY = 0;
        }

        for(let i = 0; i < speed; i++) {
            this.collisionWithCheckpoint()

            this.velX = this.velX*this.friction;
            this.velY = this.velY*this.friction;
    
            this.checkDistances();
            let output = this.neuralNetwork.calculateOutput([this.distanceLeft, this.distanceDiagLeft, this.distanceCenter, this.distanceDiagRight, this.distanceRight]);
    
            this.throttle = output[1]*2;
    
            let angle = this.body.angle;
            this.turning = output[0]*2 - 1;
            let newAngle =  angle + this.turning*this.turningSpeed;
            Matter.Body.setAngle(this.body, newAngle)
    
            this.velX += Math.sin(-angle)*(1+this.throttle);
            this.velY += Math.cos(-angle)*(1+this.throttle)
    
            if(this.velX > 5) this.velX = 5;
            if(this.velX < -5) this.velX = -5;
            if(this.velY > 5) this.velY = 5;
            if(this.velY < -5) this.velY = -5;
    
            Matter.Body.setPosition(this.body, {x: this.body.position.x + this.velX, y: this.body.position.y + this.velY})
        }
        
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

