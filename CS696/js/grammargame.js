var canvas = document.getElementById('myCanvas'), context = canvas.getContext('2d');

// Create gradient
var grd = context.createLinearGradient(0,0,960,0);
grd.addColorStop(0,"Maroon");
grd.addColorStop(1,"white");

// Fill with gradient
context.fillStyle=grd;
context.fillRect(0,0,960,63);

var problem = "Click on two nouns";

context.font = "50px Arial";
context.fillStyle = 'white';
context.fillText(problem, 280, 50);

var line1 = "Once the shiny gates opened, Jimmy ran to wait in";
var line2 = "line for the scariest ride at the amusement park.";

context.font = "40px Arial";
context.fillStyle = 'black';
context.fillText(line1, 40, 330);
context.fillText(line2, 70, 400);

//object contains both the parsed words and their widths and heights
var sentence = {words1: line1.split(" "), words2: line2.split(" "), wordwidths1:[], wordwidths2:[], clicked1:[], clicked2:[],  
	 		    startingPoint1xpos:[], startingPoint2xpos:[],
	 		    endingPoint1xpos:[], endingPoint2xpos:[],
	 		    startingPoint1ypos:300, startingPoint2ypos:370,
	 		    endingPoint1ypos:340, endingPoint2ypos: 410   
	 		};

//initializes the widths and heights of each word in the line1, as well as the starting points (xpos) of each word on the canvas
for(var i = 0; i < sentence.words1.length; ++i){
	sentence.wordwidths1[i] = measureText(sentence.words1[i], 40, 'Arial').width;
	sentence.startingPoint1xpos[i] = 0;
	sentence.clicked1[i] = false;
}
//initializes the widths and heights of each word in line2
for(var i = 0; i < sentence.words2.length; ++i){
	sentence.wordwidths2[i] = measureText(sentence.words2[i], 40, 'Arial').width;
	sentence.startingPoint2xpos[i] = 0;
	sentence.clicked2[i] = false;
}

for(var i = 0; i < sentence.words1.length; ++i){

	var j = i;

	//add 11 px for the spaces in between 
	while(j != 0)
		sentence.startingPoint1xpos[i] += sentence.wordwidths1[--j] + 11;
	
	sentence.startingPoint1xpos[i] += 40;
	sentence.endingPoint1xpos[i] = sentence.startingPoint1xpos[i] + sentence.wordwidths1[i];
}

for(var i = 0; i < sentence.words2.length; ++i){

	var j = i;

	//add 11 px for the spaces in between 
	while(j != 0)
		sentence.startingPoint2xpos[i] += sentence.wordwidths2[--j] + 11;
	
	sentence.startingPoint2xpos[i] += 70;
	sentence.endingPoint2xpos[i] = sentence.startingPoint2xpos[i] + sentence.wordwidths2[i];
}

//function returns an object containing the width and height of the passed in text
function measureText(pText, pFontSize, pStyle) {

    var lDiv = document.createElement('lDiv');

    document.body.appendChild(lDiv);

    if (pStyle != null) {
        lDiv.style = pStyle;
    }
    lDiv.style.fontSize = "" + pFontSize + "px";
    lDiv.style.position = "absolute";
    lDiv.style.left = -1000;
    lDiv.style.top = -1000;

    lDiv.innerHTML = pText;

    var lResult = {
        width: lDiv.clientWidth,
        height: lDiv.clientHeight
    };

    document.body.removeChild(lDiv);
    lDiv = null;

    return lResult;
}

/*
	returns the mouse position of the cursor in the canvas
*/
function getMousePos(canvas, evt) {

     var rect = canvas.getBoundingClientRect();
     return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
    };
}

canvas.addEventListener('mousemove', movemouse); 
        /*
          every instance of a cursor movement will cause this function to fire
        */
   
function movemouse(evt){

	var mousePos = getMousePos(canvas, evt);
    
    evt.target.style.cursor = 'default';
    
            
    for(var i = 0; i < sentence.words1.length; ++i){
    	if(mousePos.x >= sentence.startingPoint1xpos[i] && mousePos.x <= sentence.endingPoint1xpos[i] && mousePos.y >= sentence.startingPoint1ypos && mousePos.y <= sentence.endingPoint1ypos || sentence.clicked1[i] == true){
        	evt.target.style.cursor = 'pointer';
           	context.roundRect(sentence.startingPoint1xpos[i], sentence.startingPoint1ypos, sentence.endingPoint1xpos[i], sentence.endingPoint1ypos, "blue", 5);
		}
		else
           	context.roundRect(sentence.startingPoint1xpos[i], sentence.startingPoint1ypos, sentence.endingPoint1xpos[i], sentence.endingPoint1ypos, "white", 5);
        }

        for(var i = 0; i < sentence.words2.length; ++i){
           	if(mousePos.x >= sentence.startingPoint2xpos[i] && mousePos.x <= sentence.endingPoint2xpos[i] && mousePos.y >= sentence.startingPoint2ypos && mousePos.y <= sentence.endingPoint2ypos || sentence.clicked2[i] == true){
           		evt.target.style.cursor = 'pointer';
           		context.roundRect(sentence.startingPoint2xpos[i], sentence.startingPoint2ypos, sentence.endingPoint2xpos[i], sentence.endingPoint2ypos, "blue", 5);
			}
		else
           	context.roundRect(sentence.startingPoint2xpos[i], sentence.startingPoint2ypos, sentence.endingPoint2xpos[i], sentence.endingPoint2ypos, "white", 5);
        }
}

canvas.addEventListener('mousedown', mousedown); 
        /*
          fires whenever mouse is clicked 
        */
function mousedown(evt){

    var mousePos = getMousePos(canvas, evt);
            
    for(var i = 0; i < sentence.words1.length; ++i){

        if(mousePos.x >= sentence.startingPoint1xpos[i] && mousePos.x <= sentence.endingPoint1xpos[i] && mousePos.y >= sentence.startingPoint1ypos && mousePos.y <= sentence.endingPoint1ypos && sentence.clicked1[i] == true){ 			
        	sentence.clicked1[i] = false;
			context.roundRect(sentence.startingPoint1xpos[i], sentence.startingPoint1ypos, sentence.endingPoint1xpos[i], sentence.endingPoint1ypos, "white", 5);
        }
        else if(mousePos.x >= sentence.startingPoint1xpos[i] && mousePos.x <= sentence.endingPoint1xpos[i] && mousePos.y >= sentence.startingPoint1ypos && mousePos.y <= sentence.endingPoint1ypos && sentence.clicked1[i] == false){
            sentence.clicked1[i] = true;
           	context.roundRect(sentence.startingPoint1xpos[i], sentence.startingPoint1ypos, sentence.endingPoint1xpos[i], sentence.endingPoint1ypos, "blue", 5);
           	}
        }

    for(var i = 0; i < sentence.words2.length; ++i){

        if(mousePos.x >= sentence.startingPoint2xpos[i] && mousePos.x <= sentence.endingPoint2xpos[i] && mousePos.y >= sentence.startingPoint2ypos && mousePos.y <= sentence.endingPoint2ypos && sentence.clicked2[i] == true){
           	sentence.clicked2[i] = false;
			context.roundRect(sentence.startingPoint2xpos[i], sentence.startingPoint2ypos, sentence.endingPoint2xpos[i], sentence.endingPoint2ypos, "white", 5);
        }
        else if(mousePos.x >= sentence.startingPoint2xpos[i] && mousePos.x <= sentence.endingPoint2xpos[i] && mousePos.y >= sentence.startingPoint2ypos && mousePos.y <= sentence.endingPoint2ypos && sentence.clicked2[i] == false){
           	sentence.clicked2[i] = true;
           	context.roundRect(sentence.startingPoint2xpos[i], sentence.startingPoint2ypos, sentence.endingPoint2xpos[i], sentence.endingPoint2ypos, "blue", 5);
           	}
        }
}

/*
    gives rounded corners to drawn rectangles
    answer.x and answer.y are the starting points for the top left of the passed in rectangle
    answer.bx and answer.by are the ending points for the bottom right of the rectangle
    r represents the radius of the corners
*/
CanvasRenderingContext2D.prototype.roundRect = function(x, y, bx, by, color, r) {

    var r2d = Math.PI/180;
            
    this.beginPath();
    this.moveTo(x+r,y);
    this.lineTo(bx-r,y);
    this.arc(bx-r,y+r,r,r2d*270,r2d*360,false);
    this.lineTo(bx,by-r);
    this.arc(bx-r,by-r,r,r2d*0,r2d*90,false);
    this.lineTo(x+r,by);
    this.arc(x+r,by-r,r,r2d*90,r2d*180,false);
    this.lineTo(x,y+r);
    this.arc(x+r,y+r,r,r2d*180,r2d*270,false);
    this.closePath();
    this.strokeStyle = color;
    this.font = "20pt sans-serif";
    this.stroke();
};


