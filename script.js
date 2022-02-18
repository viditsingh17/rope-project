const particles = [];
function setup(){
    createCanvas(window.innerWidth, window.innerHeight);
    let noOfParticles = Math.floor(window.innerWidth/8);
    for(let i=0;i<noOfParticles;i++){
        particles.push(new Particle());
    }
}

function draw(){
    background(10, 10, 20);
    particles.forEach((p,index)=>{
        p.update();
        p.connectParticles(particles.slice(index));
        p.draw();
    });
}

class Particle{
    constructor(){
        this.pos = createVector(random(width), random(height));
        this.vel = createVector(random(-0.5,0.5), random(0.5,0.5));
        this.size = 5;
        this.z = random(-0.04, 0.04);
    }

    //make em move
    update(){
        this.pos.add(this.vel);
        this.size += this.z;
        this.bounce();
    }
    //get em on the screen
    draw() {
        noStroke();
        fill('rgb(180, 180, 255, (this.z+0.02)*10)');
        circle(this.pos.x, this.pos.y, this.size);
    }

    //don't let em out
    bounce(){
        if(this.pos.x<=0 || this.pos.x>=width){
            this.vel.x *= -1;
        }
        if(this.pos.y<=0 || this.pos.y>= height){
            this.vel.y *= -1;
        }
        if(this.size>= 8 || this.size<= 5){
            this.z *= -1;
        }
    }

    connectParticles(particles){
        particles.forEach(particle =>{
            const d = dist(this.pos.x, this.pos.y, particle.pos.x, particle.pos.y);
            if(d<=120){
                stroke('rgba(255,255,255,0.1)');
                line(this.pos.x, this.pos.y, particle.pos.x, particle.pos.y);
            }
        });
    }
}