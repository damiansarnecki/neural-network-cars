class Wall {

    static bodies = []

    constructor(x,y,width,height, angle) {
        this.body = Bodies.rectangle(x,y,width,height, {isSensor: true, isRigid: true});
        this.body.render.fillStyle = "rgb(230,230,230)";

        this.width = width;
        this.height = height;

        if(angle)
            Matter.Body.setAngle(this.body, angle)

        World.add(world, this.body)
        
        Wall.bodies.push(this.body)
    }

    
}