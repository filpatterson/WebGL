"use strict";

// function degToRad(degrees) {
//     return degrees * Math.PI / 180;
// }

var vertexColors = [
    [ 0.0, 0.0, 0.0, 1.0 ],  // black
    [ 1.0, 0.0, 0.0, 1.0 ],  // red
    [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
    [ 0.0, 1.0, 0.0, 1.0 ],  // green
    [ 0.0, 0.0, 1.0, 1.0 ],  // blue
    [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
    [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
    [ 1.0, 1.0, 1.0, 1.0 ]   // white
];


var canvas;
var gl;

//var NumVertices  = 36;

//var points = [];
//var colors = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var theta = [ 0, 0, 0 ];

var thetaLoc;



var objects = [];
var program;


// FOR SPHERE TEST


// END FOR SPHERE TEST




function readInput(){
    let tempX = document.getElementById('inpX');
    let tempY = document.getElementById('inpY');
    let tempZ = document.getElementById('inpZ');

    let tempF = document.getElementById('inpF');
    let tempR = document.getElementById('inpR');
    let tempH = document.getElementById('inpH');
    let tempC1 = document.getElementById('inpC1');
    let tempC2 = document.getElementById('inpC2');
    let tempLT = document.getElementById('inpLT');
    let tempS = document.getElementById('inpS');
    
    //var temp = document.getElementById("myInput").value;
var out =[];

     out[0] = Number(tempX.value)/100;
     out[1] = Number(tempY.value)/100;
     out[2] = Number(tempZ.value)/100;
     out[3] =tempF.value;
     out[4] =Number(tempR.value);
     out[5] =Number(tempH.value);
     out[6] =tempC1.value;
     out[7] =tempC2.value;
     out[8] =tempLT.value;
     out[9] =Number(tempS.value);
    //out.innerHTML=temp;
    console.log(out[6]);
    return {x: out[0] , y : out[1] , z : out[2], f: out[3],
            r: out[4], h: out[5], c1: out[6], c2: out[7], lt: out[8], s:out[9]};
};


    // =====================================================================
window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }


    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0, 0, 0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    thetaLoc = gl.getUniformLocation(program, "theta");



    //event listeners for buttons
     var counter = 0;
   
    document.getElementById( "xButton" ).onclick = function () {
        objects[counter-1].axis= xAxis;
    };
    document.getElementById( "yButton" ).onclick = function () {
        objects[counter-1].axis= yAxis;
    };
    document.getElementById( "zButton" ).onclick = function () {
        objects[counter-1].axis= zAxis;
     //console.log(objects[counter-1]);
    };

    document.getElementById( "delButton" ).onclick = function () {
        objects.pop();
        if(counter>0){
        counter =counter -1;}
    };


    document.getElementById( "testButton" ).onclick = function () {
       
       var coord = readInput();
       // cone 0.8 h 0.4 r
       objects.push(new Figure(coord.r, coord.h, coord.x, coord.y, coord.z, coord.s,
                              coord.f, coord.lt, coord.c1, coord.c2));
        objects[counter].draw();
        counter =counter +1;

        // objects[counter-1].axis= zAxis;
        // objects[counter-1].axis= yAxis;
        // if (coord.x!=0){
        // objects[counter-1].axis= xAxis;
        // };
    };

    

   

    render();
}
//=========================


function Figure(radius,height,x,y,z,speed, figure, lt ,c1, c2){
    this.points = [];
    this.colors = [];

    this.color1;
    this.color2;
    
    this.theta = [0,0,0];

    this.speed = speed;
    
    this.xAxis = 0;
    this.yAxis = 1;
    this.zAxis = 2;

    this.axis = 0;

    switch (c1){
        case 'black':  this.color1 = vertexColors[0]; break;
        case 'red':    this.color1 = vertexColors[1]; break;
        case 'yellow': this.color1 = vertexColors[2]; break;
        case 'green':  this.color1 = vertexColors[3]; break;
        case 'blue':   this.color1 = vertexColors[4]; break;
        case 'magenta':this.color1 = vertexColors[5]; break;
        case 'cyan':   this.color1 = vertexColors[6]; break;
        case 'white':  this.color1 = vertexColors[7]; break;
    }

    switch (c2){
        case 'black':  this.color2 = vertexColors[0]; break;
        case 'red':    this.color2 = vertexColors[1]; break;
        case 'yellow': this.color2 = vertexColors[2]; break;
        case 'green':  this.color2 = vertexColors[3]; break;
        case 'blue':   this.color2 = vertexColors[4]; break;
        case 'magenta':this.color2 = vertexColors[5]; break;
        case 'cyan':   this.color2 = vertexColors[6]; break;
        case 'white':  this.color2 = vertexColors[7]; break;
    }

    this.draw = function(){

        switch(figure){
            case 'cone':
        var conVert = vec4(0 + x,height + y,0 + z,1);



        for(var i = 0 ; i < 6.28 ; i += 0.1){
            this.points.push(conVert);        
            this.colors.push(this.color1);
            
            this.points.push(vec4(Math.cos(i) * radius + x , y, Math.sin(i) *radius + z,1) );
            this.colors.push(this.color1);
            
            this.points.push(vec4(Math.cos(i + 0.5) * radius + x ,y, Math.sin(i + 0.5) * radius + z,1) );
            this.colors.push(this.color1);
        }
    
    
        for(var i = 0 ; i < 6.28 ; i += 0.1){
            this.points.push(vec4(x,y,z,1));
            this.points.push(vec4(Math.sin(i) * radius + x,y,Math.cos(i)* radius + z,1));
            this.points.push(vec4(Math.sin(i + 0.5)* radius + x,y,Math.cos(i + 0.5)* radius + z,1));
            
            this.colors.push(this.color2);
            this.colors.push(this.color2);
            this.colors.push(this.color2);
        }
        break;
    // switch bracket below    



        case 'cylinder':
        
        for(var i = 0 ; i < 6.28 ; i += 0.1){
            this.points.push(vec4(x,y + height, z,1));
            this.points.push(vec4(Math.sin(i) * radius + x ,height + y,Math.cos(i)* radius + z ,1));
            this.points.push(vec4(Math.sin(i + 0.1) * radius + x ,height + y,Math.cos(i + 0.1)* radius + z ,1));
            
            this.colors.push(this.color2);
            this.colors.push(this.color2);
            this.colors.push(this.color2);
        }
    
        for(var i = 0 ; i < 6.28 ; i += 0.1){
            this.points.push(vec4(Math.sin(i + 0.1) * radius + x,height + y,Math.cos(i + 0.1)* radius + z,1));
            this.points.push(vec4(Math.sin(i)* radius + x ,height + y,Math.cos(i)* radius + z ,1));
            this.points.push(vec4(Math.sin(i + 0.1) * radius+ x ,y,Math.cos(i + 0.1)* radius + z ,1));
            
            this.points.push(vec4(Math.sin(i + 0.1)* radius + x,y,Math.cos(i + 0.1)* radius + z,1));
            this.points.push(vec4(Math.sin(i)* radius + x  ,height + y,Math.cos(i)* radius + z ,1));
            this.points.push(vec4(Math.sin(i)* radius + x ,y,Math.cos(i)* radius + z ,1));
            
    
            this.colors.push(this.color1);
            this.colors.push(this.color1);
            this.colors.push(this.color1);
            
            this.colors.push(this.color1);
            this.colors.push(this.color1);
            this.colors.push(this.color1);
        }
    
    
        for(var i = 0 ; i < 6.28 ; i += 0.1){
            this.points.push(vec4(x,y,z,1));
            this.points.push(vec4(Math.sin(i)* radius + x  ,y,Math.cos(i)* radius + z ,1));
            this.points.push(vec4(Math.sin(i + 0.5)* radius + x ,y,Math.cos(i + 0.5)* radius + z ,1));
            
            this.colors.push(this.color2);
            this.colors.push(this.color2);
            this.colors.push(this.color2);
        }

        break;
        case 'sphere':
        var latitudeBands = height;
        var longitudeBands = height;
       // var radius = 2;

        var vertexPositionData = [];
        // var normalData = [];
        // var textureCoordData = [];
        for (var latNumber=0; latNumber <= latitudeBands; latNumber++) {
            var theta = latNumber * Math.PI / latitudeBands;
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);

            for (var longNumber=0; longNumber <= longitudeBands; longNumber++) {
                var phi = longNumber * 2 * Math.PI / longitudeBands;
                var sinPhi = Math.sin(phi);
                var cosPhi = Math.cos(phi);

                var spx = cosPhi * sinTheta;
                var spy = cosTheta;
                var spz = sinPhi * sinTheta;

                vertexPositionData.push(vec4(radius * spx + x, radius * spy + y, radius * spz + y, 1));
            }
        }

        var indexData = [];
        for (var latNumber=0; latNumber < latitudeBands; latNumber++) {
            for (var longNumber=0; longNumber < longitudeBands; longNumber++) {
                var first = (latNumber * (longitudeBands + 1)) + longNumber;
                var second = first + longitudeBands + 1;
                var third = first + 1;
                this.points.push(vertexPositionData[first]);
                this.points.push(vertexPositionData[second]);
                this.points.push(vertexPositionData[third]);

                this.colors.push(this.color1);
                this.colors.push(this.color1);
                this.colors.push(this.color1);



                this.points.push(vertexPositionData[second]);
                this.points.push(vertexPositionData[second + 1]);
                this.points.push(vertexPositionData[third]);

                this.colors.push(this.color2);
                this.colors.push(this.color2);
                this.colors.push(this.color2);
            }
        }


        break;

        case 'sphere1':
        var latitudeBands = 30;
        var longitudeBands = 30;
   
        for (var latNumber=0; latNumber <= latitudeBands; latNumber++) {
            var theta = latNumber * Math.PI / latitudeBands;
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);

            for (var longNumber=0; longNumber <= longitudeBands; longNumber++) {
                var phi = longNumber * 2 * Math.PI / longitudeBands;
                var sinPhi = Math.sin(phi);
                var cosPhi = Math.cos(phi);

                var spx = cosPhi * sinTheta;
                var spy = cosTheta;
                var spz = sinPhi * sinTheta;
                var u = 1 - (longNumber / longitudeBands);
                var v = 1 - (latNumber / latitudeBands);

                this.points.push(vec4(radius * spx + x, radius * spy + y, radius * spz + y));
                this.colors.push(vec4(vertexColors[2]));

            }
        }




        break;
        }
    
    }



    this.render = function(){
        
        var cBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(this.colors), gl.STATIC_DRAW );
    
        var vColor = gl.getAttribLocation( program, "vColor" );
        gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vColor );
    
        var vBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(this.points), gl.STATIC_DRAW );
    
    
        var vPosition = gl.getAttribLocation( program, "vPosition" );
        gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vPosition );
    
        this.theta[this.axis] += this.speed;

        gl.uniform3fv(thetaLoc, this.theta);
        
        switch(lt){
            case 'line':
        gl.drawArrays(gl.LINE_STRIP, 0, this.points.length );
            break;

            case 'triangle':
            gl.drawArrays(gl.TRIANGLES, 0, this.points.length );
                break;
        }
    }


}

function getSphere(){
   
    for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
       var theta = latNumber * Math.PI / latitudeBands;
       var sinTheta = Math.sin(theta);
       var cosTheta = Math.cos(theta);
 //next point
       var theta1 = (latNumber+1) * Math.PI / latitudeBands;
       var sinTheta1 = Math.sin(theta1);
       var cosTheta1 = Math.cos(theta1);
 
       for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
         var phi = longNumber * 2 * Math.PI / longitudeBands;
         var sinPhi = Math.sin(phi);
         var cosPhi = Math.cos(phi);
 
         var x = cosPhi * sinTheta;
         var y = cosTheta;
         var z = sinPhi * sinTheta;
 
 //next point mai sus
         var phi1 = longNumber * 2 * Math.PI / longitudeBands;
         var sinPhi1 = Math.sin(phi1);
         var cosPhi1 = Math.cos(phi1);
 
         var x1 = cosPhi1 * sinTheta1;
         var y1 = cosTheta1;
         var z1 = sinPhi1 * sinTheta1;
 // urmatorul punct de pe circumferinta de sus
 
         var phi3 = (longNumber+1) * 2 * Math.PI / longitudeBands;
         var sinPhi3 = Math.sin(phi3);
         var cosPhi3 = Math.cos(phi3);
 
         var x3 = cosPhi3 * sinTheta1;
         var y3 = cosTheta1;
         var z3 = sinPhi3 * sinTheta1;
 // urmatorul punct pe circumferinta
          var phi2 = (longNumber+1) * 2 * Math.PI / longitudeBands;
         var sinPhi2 = Math.sin(phi2);
         var cosPhi2 = Math.cos(phi2);
 
         var x2 = cosPhi2 * sinTheta;
         var y2 = cosTheta;
         var z2 = sinPhi2 * sinTheta;
         //firs triangle
 
         // |\
         // |_\
         var color1=this.color1;
         var color2=(Math.floor(Math.random() * 10) + 1)/10;
         var color3=(Math.floor(Math.random() * 10) + 1)/10;
        //////////////////////////
         vertices.push(vec3(radius * x,radius * y,radius * z))
         colors.push(this.color1);
 
         vertices.push(vec3(radius * x1,radius * y1,radius * z1))
         colors.push(this.color1);
         vertices.push(vec3(radius * x2,radius * y2,radius * z2))
         colors.push(this.color1);        
         //second triangle
         //  _
         // \ |
         //  \|
 
         vertices.push(vec3(radius * x1,radius * y1,radius * z1))
         colors.push(vec3(color1,color2,color3)); 
         vertices.push(vec3(radius * x2,radius * y2,radius * z2))
         colors.push(vec3(color1,color2,color3)); 
         vertices.push(vec3(radius * x3,radius * y3,radius * z3))
         colors.push(vec3(color1,color2,color3)); 
 
 
       }
     }
            gl.enable(gl.DEPTH_TEST);
 
     //  Load shaders and initialize attribute buffers
 
     var program = initShaders( gl, "vertex-shader", "fragment-shader" );
     gl.useProgram( program );
 
     // Load the data into the GPU
 
     var cBuffer = gl.createBuffer();
     gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer);
     gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
 
     var vBuffer = gl.createBuffer();
     gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
     gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );
 
 
     var verticesId = gl.createBuffer();
     gl.bindBuffer( gl.ARRAY_BUFFER, verticesId );
     gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );
     
     var vPosition = gl.getAttribLocation( program, "vPosition" );
     gl.vertexAttribPointer( vPosition, 3 , gl.FLOAT, false, 0, 0 );
     gl.enableVertexAttribArray( vPosition );
 
 
     var colorsId = gl.createBuffer();
     gl.bindBuffer( gl.ARRAY_BUFFER, colorsId );
     gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
 
     var vColor = gl.getAttribLocation( program, "vColor" );
     gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0);
     gl.enableVertexAttribArray( vColor );
     gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
 
     thetaLoc = gl.getUniformLocation(program, "theta");
 
 
 }
 


function render(){
    
   

    theta[axis] += 2.0;

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    

    for(var i = 0 ; i < objects.length ; i++){
        objects[i].render();
    }
    
    // console.log( gl.TRIANGLES)
    requestAnimFrame( render );
    // 001
    // 010
    // 100

}




