"use strict";

var canvas;
var gl;
 
var objects = {};   //for setting all objects

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
//variables that will be used to choose direction of rotation

var theta = [ 0, 0, 0 ];
//variable that allows to show element in space and set direction of movement (theta[0] = X, theta[1] = Y, theta[2] = Z)

var thetaLoc;
var program;
//setting global variables, where "thetaLoc" will specify location of object in globally in space

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var eye;
//setting variables for camera

var near = -1;
var far = 1;
var radius = 1.0;
var thetaCam  = 0.0;
var phiCam    = 0.0;
var dr = 6.0 * Math.PI/180.0;

//set position of camera conform prewritten trajectory of movement
var left = -1.0;
var right = 1.0;
var ytop = 1.0;
var bottom = -1.0;

const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

window.onload = function init(){
    canvas = document.getElementById("gl-canvas");
    //creates canvas

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {alert("WebGL isn't available");}
    //sets canvas and checks its availability

    //
    //  Setting buttons for menu
    //
    document.getElementById("xButton").onclick = function () {  //button that changes direction of rotation for figure to X axis
        var name = getNameOfFigure();
        var speed = getSpeedOfRotation();
        objects[name].axis = xAxis;
        objects[name].speed = speed;
    };

    document.getElementById("yButton").onclick = function () {  //button that changes rotation to Y axis
        var name = getNameOfFigure();
        var speed = getSpeedOfRotation();
        objects[name].axis = yAxis;
        objects[name].speed = speed;
    };

    document.getElementById("zButton").onclick = function () {  //button that changes rotation to Z axis
        var name = getNameOfFigure();
        var speed = getSpeedOfRotation();
        objects[name].axis = zAxis;
        objects[name].speed = speed;
    };

    document.getElementById("setNewSpeed").onclick = function() {   //button that changes speed of rotation for object
        var name = getNameOfFigure();
        var someSpeed = getSpeedOfRotation();
        objects[name].speed = someSpeed;
    }

    //
    //  buttons for work with camera
    //
    document.getElementById("Button1").onclick = function(){near  *= 1.1; far *= 1.1;}; //moving closer
    document.getElementById("Button2").onclick = function(){near *= 0.9; far *= 0.9;};  //moving from
    document.getElementById("Button3").onclick = function(){radius *= 1.1;};    //
    document.getElementById("Button4").onclick = function(){radius *= 0.9;};    //
    document.getElementById("Button5").onclick = function(){thetaCam += dr;};   //move up
    document.getElementById("Button6").onclick = function(){thetaCam -= dr;};   //move down
    document.getElementById("Button7").onclick = function(){phiCam += dr;}; //move camera to the left
    document.getElementById("Button8").onclick = function(){phiCam -= dr;}; //move camera to the right

    document.getElementById("Create new Object").onclick = function () {    //button that creates new object for rotation

        var figure = getValueOfFigure();
        var howToShow = getHowToShow();
        var someFigureData = readMyInput();

        switch(figure){
            case 'sphere':
                objects[someFigureData.name] = new someSphere(someFigureData.x, someFigureData.y, someFigureData.z, someFigureData.r, howToShow, someFigureData.speed, someFigureData.howToColor, someFigureData.someRed, someFigureData.someGreen, someFigureData.someBlue);
                objects[someFigureData.name].draw();
                console.log(objects[someFigureData.name].axis);
                break;
            //creation of sphere

            case 'cube':
                objects[someFigureData.name] = new someCube(someFigureData.x, someFigureData.y, someFigureData.z, someFigureData.r, howToShow, someFigureData.speed, someFigureData.howToColor, someFigureData.someRed, someFigureData.someGreen, someFigureData.someBlue);
                objects[someFigureData.name].draw();
                console.log(objects[someFigureData.name].axis);
                break;
            //creation of cube 

                case 'conus':
                objects[someFigureData.name] = new someConus(someFigureData.x, someFigureData.y, someFigureData.z, someFigureData.r, howToShow, someFigureData.speed, someFigureData.howToColor, someFigureData.someRed, someFigureData.someGreen, someFigureData.someBlue);
                objects[someFigureData.name].draw();
                console.log(objects[someFigureData.name].axis);
                break;
            //creation of conus

            case 'cylinder':
                objects[someFigureData.name] = new someCylinder(someFigureData.x, someFigureData.y, someFigureData.z, someFigureData.r, howToShow, someFigureData.speed, someFigureData.howToColor, someFigureData.someRed, someFigureData.someGreen, someFigureData.someBlue);
                objects[someFigureData.name].draw();
                console.log(objects[someFigureData.name].axis);
                break;
            //creation of cylinder
        }
        
        var selectObj = document.getElementById("allObjects");
        var newOption = document.createElement("option");
        newOption.text = someFigureData.name;
        selectObj.add(newOption);
    };
    //
    //  Buttons were created
    //

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    //setting view of canvas

    gl.enable(gl.DEPTH_TEST);   

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    //
    //  Get global location of object to draw
    //
    thetaLoc = gl.getUniformLocation(program, "theta");

    //
    //  Setting camera in space
    //
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");

    globalRender();
    //draw all objects that were created

    requestAnimationFrame(globalRender);
    //request frame for stabilization of framerate
}

function someSphere(placeX, placeY, placeZ ,radius, howToShow, speedOfRotation, howToColor, someRed, someGreen, someBlue){ 
    this.theta = [ 0, 0, 0 ];
    this.axis = 0;  //direction of rotation (0 = X, 1 = Y, 2 = Z)
    this.points = []; 
    this.colors = []; 
    this.speed = speedOfRotation;
    this.draw = function(){ 
        var vertexPositionData = [];    //it will be used for setting connections between points
        //
        //  setting all bands for this sphere
        //
        var latitudeBands = 36;
        var longitudeBands = 36;

        //
        //  setting all points and coming throught all latitudes
        //
        for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
            var theta = latNumber * Math.PI / latitudeBands; 
            var sinTheta = Math.sin(theta); 
            var cosTheta = Math.cos(theta); 
            //
            //coming through all longitudes
            //
            for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) { 
                //
                //  for each polygon of this sphere
                //
                var phi = longNumber * 2 * Math.PI / longitudeBands; 
                var sinPhi = Math.sin(phi); 
                var cosPhi = Math.cos(phi); 
                //
                //setting all points
                //
                var x = cosPhi * sinTheta; 
                var y = cosTheta; 
                var z = sinPhi * sinTheta;

                vertexPositionData.push(vec4(radius * x + placeX , radius * y + placeY, radius * z + placeZ, 1));
            } 
        } 
        //
        //  pushing points with setting polygons of sphere
        //
        for (var latNumber = 0; latNumber < latitudeBands; latNumber++) { 
            for (var longNumber = 0; longNumber < longitudeBands; longNumber++) { 
                var first = (latNumber * (longitudeBands + 1)) + longNumber; 
                var second = first + longitudeBands + 1;
                var third = first + 1;

                //
                //  setting first half of rectangle
                //
                this.points.push(vertexPositionData[first]); 
                this.points.push(vertexPositionData[second]);
                this.points.push(vertexPositionData[third]);

                if(howToColor == 1){
                    this.colors.push(vec4(someRed, someGreen, someBlue, 1)); 
                    this.colors.push(vec4(someRed, someGreen, someBlue, 1));
                    this.colors.push(vec4(someRed, someGreen, someBlue, 1));
                }
                else {
                    this.colors.push(vec4(Math.random(),Math.random(),Math.random(),1)); 
                    this.colors.push(vec4(Math.random(),Math.random(),Math.random(),1)); 
                    this.colors.push(vec4(Math.random(),Math.random(),Math.random(),1)); 
                }

                //
                //  setting another half of rectangle
                // 
                this.points.push(vertexPositionData[second])
                this.points.push(vertexPositionData[second + 1]);
                this.points.push(vertexPositionData[third]);
                 
                if(howToColor == 1){
                    this.colors.push(vec4(someRed, someGreen, someBlue, 1)); 
                    this.colors.push(vec4(someRed, someGreen, someBlue, 1));
                    this.colors.push(vec4(someRed, someGreen, someBlue, 1));
                }
                else {
                    this.colors.push(vec4(Math.random(),Math.random(),Math.random(),1)); 
                    this.colors.push(vec4(Math.random(),Math.random(),Math.random(),1)); 
                    this.colors.push(vec4(Math.random(),Math.random(),Math.random(),1)); 
                }
            } 
        } 

    } 

    this.render = function(){   //fucntion for drawing of sphere
        createBufferData(this.points, this.colors);

        //rotation
        this.theta[this.axis] += this.speed;
        gl.uniform3fv(thetaLoc, this.theta);

        //
        //  How to draw (lines or triangles)
        //
        if(howToShow == 1)
            gl.drawArrays(gl.TRIANGLES, 0, this.points.length);
        if(howToShow == 0)
            gl.drawArrays(gl.LINE_STRIP, 0, this.points.length); 

    } 
} 

function someCube(x, y, z, radius, howToShow, speedOfRotation, howToColor, someRed, someGreen, someBlue){
    this.theta = [ 0, 0, 0 ];
    this.axis = 0;  //direction of rotation (0 = X, 1 = Y, 2 = Z)
    this.points = [];
    this.colors = [];
    this.speed = speedOfRotation;
    this.draw = function(){
        //
        //  set positions for points
        //
        var vertexPositionData = [
            //
            //points from the top
            //
            vec4( x + radius, y + radius, z + radius, 1.0 ),
            vec4( x - radius, y + radius, z + radius, 1.0 ),
            vec4( x + radius, y - radius, z + radius, 1.0 ),
            vec4( x - radius, y - radius, z + radius, 1.0 ),
            //
            //points from the bottom left
            //
            vec4( x - radius, y + radius, z - radius, 1.0 ),
            vec4( x - radius, y - radius, z - radius, 1.0 ),
            //
            //points from the bottom right
            //
            vec4( x + radius, y + radius, z - radius, 1.0 ),
            vec4( x + radius, y - radius, z - radius, 1.0 ),
        ];
        //
        //  setting rectangles for drawing cube
        //
        var vertexIndices = [
            //top
            1, 0, 2,
            1, 3, 2,
            //left
            1, 3, 5,
            1, 4, 5,
            //bottom
            4, 5, 7,
            4, 6, 7,
            //right
            2, 7, 6,
            2, 0, 6,
            //front
            1, 4, 6,
            1, 0, 6,
            //back
            2, 7, 5,
            2, 3, 5,
        ];
        //
        //pushing all those points and their colors to the buffer for next work
        //
        for(var i = 0; i < vertexIndices.length; i++){
            this.points.push(vertexPositionData[vertexIndices[i]]);
            if(howToColor == 1)
                this.colors.push(vec4(someRed, someGreen, someBlue, 1)); 
            else
                this.colors.push(vec4(Math.random(),Math.random(),Math.random(),1)); 
        }

    }

    this.render = function(){   //function for drawing of cube
        //creating and setting all buffers
        createBufferData(this.points, this.colors);
        //rotation
        this.theta[this.axis] += this.speed;
        gl.uniform3fv(thetaLoc, this.theta);
        //
        //  How to Draw (lines and triangles)
        //
        if(howToShow == 1)
            gl.drawArrays(gl.TRIANGLES, 0, this.points.length);
        if(howToShow == 0)
            gl.drawArrays(gl.LINE_STRIP, 0, this.points.length); 
    }
}

function someConus(x, y, z, radius, howToShow, speedOfRotation, howToColor, someRed, someGreen, someBlue){
    this.theta = [ 0, 0, 0 ];
    this.axis = 0;  //direction of rotation (0 = X, 1 = Y, 2 = Z)
    this.colors = [];
    this.points = [];
    this.speed = speedOfRotation;
    var height = 0.3;
    this.draw = function(){
        //
        //  Draw side and top parts
        //
        for(var i = 0 ; i < Math.PI * 2 ; i += 0.1)
        {
            var conVert = vec4(x, height + y, z, 1);

            this.points.push(conVert);
            this.points.push(vec4(Math.cos(i) * radius + x , y, Math.sin(i) * radius + z,1));
            this.points.push(vec4(Math.cos(i + 0.1) * radius + x ,y, Math.sin(i + 0.1) * radius + z,1));
        
            if(howToColor == 1){
                this.colors.push(vec4(someRed, someGreen, someBlue, 1)); 
                this.colors.push(vec4(someRed, someGreen, someBlue, 1));
                this.colors.push(vec4(someRed, someGreen, someBlue, 1));
            }
            else {
                this.colors.push(vec4(Math.random(),Math.random(),Math.random(),1)); 
                this.colors.push(vec4(Math.random(),Math.random(),Math.random(),1)); 
                this.colors.push(vec4(Math.random(),Math.random(),Math.random(),1)); 
            }
        }
        
        //
        //  Draw bottom of Conus
        //
        for(var i = 0 ; i < Math.PI * 2 ; i += 0.1)
        {
            this.points.push(vec4(x, y, z, 1));
            this.points.push(vec4(Math.sin(i) * radius + x,y,Math.cos(i) * radius + z,1));
            this.points.push(vec4(Math.sin(i + 0.1) * radius + x, y, Math.cos(i + 0.1) * radius + z, 1));

            if(howToColor == 1){
                this.colors.push(vec4(someRed, someGreen, someBlue, 1)); 
                this.colors.push(vec4(someRed, someGreen, someBlue, 1));
                this.colors.push(vec4(someRed, someGreen, someBlue, 1));
            }
            else {
                this.colors.push(vec4(Math.random(),Math.random(),Math.random(),1)); 
                this.colors.push(vec4(Math.random(),Math.random(),Math.random(),1)); 
                this.colors.push(vec4(Math.random(),Math.random(),Math.random(),1)); 
            }
        }

    }

    this.render = function(){   //function for drawing of conus

        createBufferData(this.points,this.colors);
        //rotation
        this.theta[this.axis] += this.speed;
        gl.uniform3fv(thetaLoc, this.theta);
        //
        //  How to draw object (lines or triangles)
        //
        if(howToShow == 1)
            gl.drawArrays(gl.TRIANGLES, 0, this.points.length);
        if(howToShow == 0)
            gl.drawArrays(gl.LINE_STRIP, 0, this.points.length); 
    }
}

function someCylinder(x, y, z, radius, howToShow, speedOfRotation, howToColor, someRed, someGreen, someBlue){
    this.theta = [ 0, 0, 0 ];
    this.axis = 0;  //direction of rotation (0 = X, 1 = Y, 2 = Z)
    this.colors = [];
    this.points = [];
    this.speed = speedOfRotation;
    var height = 0.3;
    this.draw = function(){
        //
        //  setting all points for the top
        //
        for(var i = 0 ; i < Math.PI * 2 ; i += 0.1){
            this.points.push(vec4(x, y + height, z, 1));
            this.points.push(vec4(Math.sin(i) * radius + x ,height + y, Math.cos(i) * radius + z ,1));
            this.points.push(vec4(Math.sin(i + 0.1) * radius + x, height + y, Math.cos(i + 0.1) * radius + z, 1));
            
            if(howToColor == 1){
                this.colors.push(vec4(someRed, someGreen, someBlue, 1)); 
                this.colors.push(vec4(someRed, someGreen, someBlue, 1));
                this.colors.push(vec4(someRed, someGreen, someBlue, 1));
            }
            else {
                this.colors.push(vec4(Math.random(),Math.random(),Math.random(),1)); 
                this.colors.push(vec4(Math.random(),Math.random(),Math.random(),1)); 
                this.colors.push(vec4(Math.random(),Math.random(),Math.random(),1)); 
            }
        }
        //
        //  setting points from the side of cylinder
        //
        for(var i = 0 ; i < Math.PI * 2 ; i += 0.1){
            this.points.push(vec4(Math.sin(i + 0.1) * radius + x,height + y,Math.cos(i + 0.1)* radius + z,1));
            this.points.push(vec4(Math.sin(i) * radius + x, height + y, Math.cos(i) * radius + z, 1));
            this.points.push(vec4(Math.sin(i + 0.1) * radius+ x , y, Math.cos(i + 0.1) * radius + z, 1));
            
            this.points.push(vec4(Math.sin(i + 0.1) * radius + x, y, Math.cos(i + 0.1) * radius + z, 1));
            this.points.push(vec4(Math.sin(i) * radius + x, height + y, Math.cos(i) * radius + z, 1));
            this.points.push(vec4(Math.sin(i) * radius + x, y, Math.cos(i) * radius + z, 1));
            
            if(howToColor == 1){
                this.colors.push(vec4(someRed, someGreen, someBlue, 1)); 
                this.colors.push(vec4(someRed, someGreen, someBlue, 1));
                this.colors.push(vec4(someRed, someGreen, someBlue, 1));

                this.colors.push(vec4(someRed, someGreen, someBlue, 1)); 
                this.colors.push(vec4(someRed, someGreen, someBlue, 1));
                this.colors.push(vec4(someRed, someGreen, someBlue, 1));
            }
            else {
                this.colors.push(vec4(Math.random(),Math.random(),Math.random(),1)); 
                this.colors.push(vec4(Math.random(),Math.random(),Math.random(),1)); 
                this.colors.push(vec4(Math.random(),Math.random(),Math.random(),1)); 

                this.colors.push(vec4(Math.random(),Math.random(),Math.random(),1)); 
                this.colors.push(vec4(Math.random(),Math.random(),Math.random(),1)); 
                this.colors.push(vec4(Math.random(),Math.random(),Math.random(),1)); 
            }
        }
        //
        //  setting all points for bottom of cylinder
        //
        for(var i = 0 ; i < Math.PI * 2 ; i += 0.1){
            this.points.push(vec4(x,y,z,1));
            this.points.push(vec4(Math.sin(i)* radius + x  ,y,Math.cos(i)* radius + z ,1));
            this.points.push(vec4(Math.sin(i + 0.1)* radius + x ,y,Math.cos(i + 0.1)* radius + z ,1));

            if(howToColor == 1){
                this.colors.push(vec4(someRed, someGreen, someBlue, 1)); 
                this.colors.push(vec4(someRed, someGreen, someBlue, 1));
                this.colors.push(vec4(someRed, someGreen, someBlue, 1));
            }
            else {
                this.colors.push(vec4(Math.random(),Math.random(),Math.random(),1)); 
                this.colors.push(vec4(Math.random(),Math.random(),Math.random(),1)); 
                this.colors.push(vec4(Math.random(),Math.random(),Math.random(),1)); 
            }
        }
    }

    this.render = function(){

        createBufferData(this.points,this.colors);
        //rotation
        this.theta[this.axis] += this.speed;
        gl.uniform3fv(thetaLoc, this.theta);
        //
        //  how to draw cylinder (triangles and lines)
        //
        if(howToShow == 1)
            gl.drawArrays(gl.TRIANGLES, 0, this.points.length);
        if(howToShow == 0)
            gl.drawArrays(gl.LINE_STRIP, 0, this.points.length); 
    }
}

function createBufferData(points, colors){
    //
    //create buffer for colors
    //
    var cBuffer = gl.createBuffer(); 
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer); 
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW); 
    //
    //set buffer for colors
    //
    var vColor = gl.getAttribLocation(program, "vColor"); 
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0); 
    gl.enableVertexAttribArray(vColor); 
    //
    //create buffer for vertexes
    //
    var vBuffer = gl.createBuffer(); 
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer); 
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW); 
    //
    //set buffer for vertexes
    //
    var vPosition = gl.getAttribLocation(program, "vPosition"); 
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0); 
    gl.enableVertexAttribArray(vPosition); 
} 

function globalRender(){
    //
    //clear color and depth of our canvas
    //
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //
    //render all objects using their render() functions
    //
    for(var key in objects){
        objects[key].render();
    }

    //
    //  setting position of camera and field of view
    //
    eye = vec3(radius*Math.sin(phiCam), radius*Math.sin(thetaCam),
    radius*Math.cos(phiCam));

    //
    //  Setting camera to look at the point of "eye" and wtf?
    //
    modelViewMatrix = lookAt(eye, at , up);
    projectionMatrix = ortho(left, right, bottom, ytop, near, far);

    //
    //  model camera and set projection of all points to this camera
    //
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    //request frame to make sure that there will not appear any bugs
    requestAnimFrame(globalRender);
}
//
//  Setting some functions for comfort of using code and better code organization
//
//
//  function that gets type of object that user wants to create
//
function getValueOfFigure(){
    var selectedValue = document.getElementById("Figure").value;
    return selectedValue;
}

//
//  how to show object: filled or carcas only?
//
function getHowToShow(){
    let valueOfHowToShow = document.getElementById("How to show").value;
    var result = Number(valueOfHowToShow);
    return result;
}

//
//  gets name of object inputted by user
//
function getNameOfFigure(){
    var nameOfFigure = document.getElementById("allObjects").value;
    return nameOfFigure;
}

//
//  gets speed of rotation for object
//
function getSpeedOfRotation(){
    var someSpeed = document.getElementById('someSp').value;
    return Number(someSpeed);
}

//
// reads all parameters that were inputted by user
//
function readMyInput(){
    //
    //  read all cordinates from HTML file
    //
    let someX = document.getElementById('someX');
    let someY = document.getElementById('someY');
    let someZ = document.getElementById('someZ');
    //
    //  read height and radius
    //
    let someR = document.getElementById('someR');
    let someSp = document.getElementById('someSp');
    //
    //  read name of figure
    //
    let nameOfFigure = document.getElementById('NameOfFigure');
    //
    //  how to color and values of colors
    //
    let howToColor = document.getElementById('HowToColor');
    let someRed = document.getElementById('someRed');
    let someGreen = document.getElementById('someGreen');
    let someBlue = document.getElementById('someBlue');

    //
    //  set all parameters as fields of this function
    //
    var result = [];
    result[0] = Number(someX.value);
    result[1] = Number(someY.value);
    result[2] = Number(someZ.value);
    result[3] = Number(someR.value);
    result[4] = Number(someSp.value);
    result[5] = nameOfFigure.value;
    result[6] = Number(howToColor.value);
    result[7] = Number(someRed.value) / 50;
    result[8] = Number(someGreen.value) / 50;
    result[9] = Number(someBlue.value) / 50;
    return {x: result[0] , y : result[1] , z : result[2], r: result[3], speed: result[4], name: result[5], howToColor: result[6], someRed: result[7], someGreen: result[8], someBlue: result[9]};
}