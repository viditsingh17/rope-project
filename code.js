/*
We have thee types of objects:
    Fixed point - click a point
    Stick - drag two points
    dyanamic point - single click
*/
const height = 500, width = 500;
var g = 0.5;
var n = 10;
const drag = 0.999;
const k = 0.95;
var rounds = 5;
var simulationRunning = false;
var aleradyMakingStick = false;


var points = [];
var sticks = [];

class Point{
    constructor(x,y) {
        this.fixed = false;
        this.x = x;
        this.y = y;
        this.oldX = x;
        this.oldY = y;
    }
    makeFixed(){
        this.fixed = true;
    }
}

class Stick{
    constructor(p1,p2){
        let l = dist(p1.x, p1.y, p2.x, p2.y);
        console.log(l);
        this.length = l;
        this.p1 = p1;
        this.p2 = p2;
    }
}

var tempPoint = new Point(0,0);

function updatePoints(){
    for(var i=0;i<points.length;i++){
        var p = points[i];
        if(!p.fixed){
            console.log(p.y);
            var vx = (p.x - p.oldX)*drag;
            var vy = (p.y - p.oldY)*drag;

            vy += g;

            p.oldX = p.x;
            p.oldY = p.y;
            p.x += vx;
            p.y += vy;
           
        }
    }
}
function constrainPoints(){
    for(var i=0;i<points.length;i++){
        var p = points[i];
        
        var vx = (p.x - p.oldX)*drag;
        var vy = (p.y - p.oldY)*drag;

        if(p.x>width){
            p.x = width;
            p.oldX = p.x + vx*k;
        }
        else if(p.x<0){
            p.x=0;
            p.oldX = p.x + vx*k;
        }
        if(p.y>height){
            p.y=height;
            p.oldY = p.y + vy*k;
        }
        else if(p.y<0){
            p.y=0;
            p.oldY = p.y + vy*k;
        }
    }
}

function updateSticks(){
    for(var i=0;i<sticks.length;i++){
        s = sticks[i];
        // mx = (s.p2.x + s.p1.x)/2;
        // my = (s.p2.y + s.p1.y)/2;

        var dx = s.p2.x - s.p1.x;
        var dy = s.p2.y - s.p1.y;
        var distance = sqrt(dx*dx + dy*dy);
        var percent = (s.length-distance)/distance/2;
        var offsetX = dx*percent;
        var offsetY = dy*percent;
        

        // for(var j=0;j<rounds;j++){
            if(s.p1.fixed && !s.p2.fixed){
                // p1 fixed
                s.p2.x+= offsetX*2;
                s.p2.y+= offsetY*2;
            }
            else if(!s.p1.fixed && s.p2.fixed){
                // p2 fixed
                s.p1.x-= offsetX*2;
                s.p1.y-= offsetY*2;
            }
            else if(!s.p1.fixed && !s.p2.fixed){
                //none 
                s.p1.x-= offsetX;
                s.p1.y-= offsetY;
                s.p2.x+= offsetX;
                s.p2.y+= offsetY;
            }
        // }
    }
}

//render functions
function renderPoints(){
    for(var i=0;i<points.length;i++){
        var p = points[i];
        if(p.fixed){
            fill(255,100,100);
        }
        else{
            fill(50);
        }
        ellipse(p.x, p.y, 10, 10);
    }
}

function renderSticks(){
    for(var i=0;i<sticks.length;i++){
        var s = sticks[i];
        push()
        stroke(80, 200, 100);
        strokeWeight(5);
        line(s.p1.x, s.p1.y, s.p2.x, s.p2.y);
        pop();
    }
}

function renderUnconnectedStick(){
    if(aleradyMakingStick){
        push();
        stroke(10);
        strokeWeight(5);
        line(tempPoint.x,tempPoint.y,mouseX,mouseY);
        pop();
    }
}

//*****************************************************************************
function setup(){
    createCanvas(height, width);
}

function draw(){
    background(255, 250, 250);
    if(simulationRunning){
        updatePoints();
        for(var i=0;i<rounds;i++){
            updateSticks();
            constrainPoints();
        }
    }
    renderPoints();
    renderUnconnectedStick();
    renderSticks();
}
//*****************************************************************************

function mouseClicked(){
    if(mouseX>width || mouseX<0 || mouseY>height || mouseY<0) return;
    if(keyIsDown(17)){
        //if ctrl is pressed
        for(var i=0;i<points.length;i++){
            var p = points[i];
            if(abs(p.x - mouseX)<=5 && abs(p.y - mouseY )<= 5){
                if(aleradyMakingStick){
                    //start making stick from the center of the point
                    if(points.indexOf(tempPoint)!=points.indexOf(p))
                    sticks.push(new Stick(tempPoint, p));


                    aleradyMakingStick = false;
                }
                else{
                    //stop the stick to the center of the point
                    tempPoint = p;
                    //render the un connected stick


                    aleradyMakingStick = true;
                }
            }
        }
        
    }
    else{
        var flag = false;
        for(var i=0;i<points.length;i++){
        var p = points[i];
        if(abs(p.x - mouseX)<=5 && abs(p.y - mouseY)<= 5){
            if(p.fixed){
                p.fixed = false;
            }
            else{
                p.fixed = true;
            }
            flag = true;
            break;
        }
        else{
            //stop the stick if making
            aleradyMakingStick = false;
        }
    }
    if(!flag)
    points.push(new Point(mouseX, mouseY));
    }
    
}



//ui buttons
function run() {
    simulationRunning = true;
}
function stop() {
    simulationRunning = false;
}
function clean(){
    points = [];
    sticks = [];
}