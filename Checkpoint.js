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