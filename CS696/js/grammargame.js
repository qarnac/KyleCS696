var canvas = document.getElementById('myCanvas'), context = canvas.getContext('2d');

// Create gradient
var grd = context.createLinearGradient(0,0,960,0);
grd.addColorStop(0,"Maroon");
grd.addColorStop(1,"white");

var problem = "";

var buttonOff = new Image();
buttonOff.onload = function(){
	context.drawImage(buttonOff,0,0,81,48,450,480,81,48);
};
buttonOff.src = "../img/buttonOff.png";

var buttonOn = new Image();
buttonOn.src = "../img/buttonOn.png";

var checkMark = new Image();
checkMark.src = "../img/checkMark.png";

var errorMark = new Image();
errorMark.src = "../img/errorMark.png";

//sentence object contains both the parsed words, widths, heights, starting points, and ending points
var sentence = {words1:[""], words2:[""], wordwidths1:[], wordwidths2:[], clicked1:[], clicked2:[],  
	 		    startingPoint1xpos:[], startingPoint2xpos:[],
	 		    endingPoint1xpos:[], endingPoint2xpos:[], 
	 		    startingPoint1ypos:300, startingPoint2ypos:370,
	 		    endingPoint1ypos:340, endingPoint2ypos: 410,
	 		    startLine1:0, startLine2:0,
	 		    line1: "", line2:"",
	 		    correct: 0, answerWrong: false, problemCount: 1   
	 		};
//answers object contains string arrays for each problem type
var answers = {nouns:[""],verbs:[""],adjectives:[""]};

//initialize the lines for the sentence
sentence.line1 = "Once the shiny gates opened, Jimmy ran to wait in";
sentence.line2 = "line for the scariest ride at Disneyland.";
answers.nouns = ["gates", "Jimmy", "line", "ride", "Disneyland."];
answers.verbs = ["opened,", "ran", "wait"];
answers.adjectives = ["shiny", "scariest"];

parseSentence();
initializeClicked();
calculateBegEnd();
displaySentence();
calculateWordWidths();
calculateWordPoints();


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
  
    for(var i = 0; i < sentence.words1.length; ++i){
    	if(mousePos.x >= sentence.startingPoint1xpos[i] && mousePos.x <= sentence.endingPoint1xpos[i] && mousePos.y >= sentence.startingPoint1ypos && mousePos.y <= sentence.endingPoint1ypos && sentence.clicked1[i] == false)
           	context.roundRect(sentence.startingPoint1xpos[i], sentence.startingPoint1ypos, sentence.endingPoint1xpos[i], sentence.endingPoint1ypos, "blue", 5);
		else if(mousePos.x >= sentence.startingPoint1xpos[i] && mousePos.x <= sentence.endingPoint1xpos[i] && mousePos.y >= sentence.startingPoint1ypos && mousePos.y <= sentence.endingPoint1ypos || sentence.clicked1[i] == true)
			context.roundRect(sentence.startingPoint1xpos[i], sentence.startingPoint1ypos, sentence.endingPoint1xpos[i], sentence.endingPoint1ypos, "red", 5);
		else
           	context.roundRect(sentence.startingPoint1xpos[i], sentence.startingPoint1ypos, sentence.endingPoint1xpos[i], sentence.endingPoint1ypos, "white", 5);	
    }
        
    for(var i = 0; i < sentence.words2.length; ++i){
        if(mousePos.x >= sentence.startingPoint2xpos[i] && mousePos.x <= sentence.endingPoint2xpos[i] && mousePos.y >= sentence.startingPoint2ypos && mousePos.y <= sentence.endingPoint2ypos && sentence.clicked2[i] == false)
           	context.roundRect(sentence.startingPoint2xpos[i], sentence.startingPoint2ypos, sentence.endingPoint2xpos[i], sentence.endingPoint2ypos, "blue", 5);
		else if(mousePos.x >= sentence.startingPoint2xpos[i] && mousePos.x <= sentence.endingPoint2xpos[i] && mousePos.y >= sentence.startingPoint2ypos && mousePos.y <= sentence.endingPoint2ypos || sentence.clicked2[i] == true)
			context.roundRect(sentence.startingPoint2xpos[i], sentence.startingPoint2ypos, sentence.endingPoint2xpos[i], sentence.endingPoint2ypos, "red", 5);
		else
           	context.roundRect(sentence.startingPoint2xpos[i], sentence.startingPoint2ypos, sentence.endingPoint2xpos[i], sentence.endingPoint2ypos, "white", 5);
    }

    if(mousePos.x >= 450 && mousePos.x <= 531 && mousePos.y >= 480 && mousePos.y <= 528){
    	context.drawImage(buttonOn,0,0,81,48,450,480,81,48);
    }
    else
    	buttonOff.onload();
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
			document.getElementById('clickOut').play();
        }
        else if(mousePos.x >= sentence.startingPoint1xpos[i] && mousePos.x <= sentence.endingPoint1xpos[i] && mousePos.y >= sentence.startingPoint1ypos && mousePos.y <= sentence.endingPoint1ypos && sentence.clicked1[i] == false){
            sentence.clicked1[i] = true;
           	context.roundRect(sentence.startingPoint1xpos[i], sentence.startingPoint1ypos, sentence.endingPoint1xpos[i], sentence.endingPoint1ypos, "red", 5);
           	document.getElementById('clickIn').play();
        }
    }

    for(var i = 0; i < sentence.words2.length; ++i){

        if(mousePos.x >= sentence.startingPoint2xpos[i] && mousePos.x <= sentence.endingPoint2xpos[i] && mousePos.y >= sentence.startingPoint2ypos && mousePos.y <= sentence.endingPoint2ypos && sentence.clicked2[i] == true){
           	sentence.clicked2[i] = false;
			context.roundRect(sentence.startingPoint2xpos[i], sentence.startingPoint2ypos, sentence.endingPoint2xpos[i], sentence.endingPoint2ypos, "white", 5);
			document.getElementById('clickOut').play();
        }
        else if(mousePos.x >= sentence.startingPoint2xpos[i] && mousePos.x <= sentence.endingPoint2xpos[i] && mousePos.y >= sentence.startingPoint2ypos && mousePos.y <= sentence.endingPoint2ypos && sentence.clicked2[i] == false){
           	sentence.clicked2[i] = true;
           	context.roundRect(sentence.startingPoint2xpos[i], sentence.startingPoint2ypos, sentence.endingPoint2xpos[i], sentence.endingPoint2ypos, "red", 5);
           	document.getElementById('clickIn').play();
        }
    }

    if(mousePos.x >= 450 && mousePos.x <= 531 && mousePos.y >= 480 && mousePos.y <= 528){
    	
    	doneClicked();
    }
}

/*
Helper functions
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------
*/

//initializes the words arrays by parsing the sentence
function parseSentence(){
	sentence.words1 = sentence.line1.split(" ");
	sentence.words2 = sentence.line2.split(" ");	
}	

//calculates the starting point of line1 and line2
function calculateBegEnd(){
	sentence.startLine1 = measureText(sentence.line1, 40, 'Arial').width;
	sentence.startLine1 = (960 - sentence.startLine1) / 2;

	sentence.startLine2 = measureText(sentence.line2, 40, 'Arial').width;
	sentence.startLine2 = (960 - sentence.startLine2) / 2;
}

//displays the sentence on screen
function displaySentence(){
	context.font = "40px Arial";
	context.fillStyle = 'black';
	context.fillText(sentence.line1, sentence.startLine1, 330);
	context.fillText(sentence.line2, sentence.startLine2, 400);

	// Fill with gradient
	context.fillStyle=grd;
	context.fillRect(0,0,960,63);
	context.font = "50px Arial";
	context.fillStyle = 'white';

	if(sentence.problemCount % 3 == 1){
		problem = "Click on three nouns";
		context.fillText(problem, 280, 50);
	}
	else if(sentence.problemCount % 3 == 2){
		problem = "Click on three verbs";
		context.fillText(problem, 280, 50);
	}
	else{
		problem = "Click on two adjectives";
		context.fillText(problem, 235, 50);
	}
}

function initializeClicked(){

	for(var i = 0; i < sentence.words1.length; ++i)
		sentence.clicked1[i] = false;
	
	for(var i = 0; i < sentence.words2.length; ++i)
		sentence.clicked2[i] = false;
}


//calculates the widths of each word in the line1 and line2
function calculateWordWidths(){
	for(var i = 0; i < sentence.words1.length; ++i){
		sentence.wordwidths1[i] = measureText(sentence.words1[i], 40, 'Arial').width;
		sentence.startingPoint1xpos[i] = 0;
	}

	for(var i = 0; i < sentence.words2.length; ++i){
		sentence.wordwidths2[i] = measureText(sentence.words2[i], 40, 'Arial').width;
		sentence.startingPoint2xpos[i] = 0;
	}
}

//calculates the starting and ending points for the words in line1
function calculateWordPoints(){
	for(var i = 0; i < sentence.words1.length; ++i){

		var j = i;
		//add the widths of the previous words while adding additional widths for spaces, commas, and periods. 
		while(j != 0){
			--j;
			if(sentence.words1[j].charAt(sentence.words1[j].length - 1) == ',' || sentence.words1[j].charAt(sentence.words1[j].length - 1) == '.'){
				sentence.startingPoint1xpos[i] += sentence.wordwidths1[j] + 22;
				
			}
			else
				sentence.startingPoint1xpos[i] += sentence.wordwidths1[j] + 11;
 		}
		//add the space between the left boundary and the 1st word to get the final starting point of the current word in the sentence
		sentence.startingPoint1xpos[i] += sentence.startLine1;
		//ending point is the starting point plus the width of the current word
		sentence.endingPoint1xpos[i] = sentence.startingPoint1xpos[i] + sentence.wordwidths1[i];
	}

	//calculates the starting and ending points for the words in line2
	for(var i = 0; i < sentence.words2.length; ++i){

		var j = i;
		//add the widths of the previous words while adding additional widths for spaces, commas, and periods. 
		while(j != 0){
			--j;
			if(sentence.words2[j].charAt(sentence.words2[j].length - 1) == ',' || sentence.words2[j].charAt(sentence.words2[j].length - 1) == '.'){
				sentence.startingPoint2xpos[i] += sentence.wordwidths2[j] + 22;
				
			}
			else
				sentence.startingPoint2xpos[i] += sentence.wordwidths2[j] + 11;
 		}
		//add the space between the left boundary and the 1st word to get the final starting point of the current word in the sentence
		sentence.startingPoint2xpos[i] += sentence.startLine2;
		//ending point is the starting point plus the width of the current word
		sentence.endingPoint2xpos[i] = sentence.startingPoint2xpos[i] + sentence.wordwidths2[i];
	}
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

    pText = pText.replace(',' , "" );
    pText = pText.replace('.' , "" );


    lDiv.innerHTML = pText;

    var lResult = {
        width: lDiv.clientWidth,
        height: lDiv.clientHeight
    };

    document.body.removeChild(lDiv);
    lDiv = null;

    return lResult;
}



function doneClicked(){

		
		sentence.answerWrong = false;

		//nouns
		if(sentence.problemCount % 3 == 1){

			for(var i = 0; i < sentence.words1.length; ++i){

				if(sentence.clicked1[i] == true){
					var tempCount = 0;
					for(var j = 0; j < answers.nouns.length; ++j){

						if(sentence.words1[i] == answers.nouns[j]){
							++tempCount;
							++sentence.correct;
						}
					}

					if(tempCount == 0){
						sentence.answerWrong = true;
						
					}
				}
			}

			for(var i = 0; i < sentence.words2.length; ++i){

				if(sentence.clicked2[i] == true){
					var tempCount = 0;
					for(var j = 0; j < answers.nouns.length; ++j){

						if(sentence.words2[i] == answers.nouns[j]){
							++tempCount;
							++sentence.correct;
						}
					}

					if(tempCount == 0){
						sentence.answerWrong = true;
						
					}
				}
			}
		}
		//verbs
		else if(sentence.problemCount % 3 == 2){

			for(var i = 0; i < sentence.words1.length; ++i){

				if(sentence.clicked1[i] == true){
					var tempCount = 0;
					for(var j = 0; j < answers.verbs.length; ++j){

						if(sentence.words1[i] == answers.verbs[j]){
							++tempCount;
							++sentence.correct;
						}
					}

					if(tempCount == 0){
						sentence.answerWrong = true;
						
					}
				}
			}

			for(var i = 0; i < sentence.words2.length; ++i){

				if(sentence.clicked2[i] == true){
					var tempCount = 0;
					for(var j = 0; j < answers.verbs.length; ++j){

						if(sentence.words2[i] == answers.verbs[j]){
							++tempCount;
							++sentence.correct;
						}
					}

					if(tempCount == 0){
						sentence.answerWrong = true;
						
					}
				}
			}
		}
		//adjectives
		else{

			for(var i = 0; i < sentence.words1.length; ++i){

				if(sentence.clicked1[i] == true){
					var tempCount = 0;
					for(var j = 0; j < answers.adjectives.length; ++j){

						if(sentence.words1[i] == answers.adjectives[j]){
							++tempCount;
							++sentence.correct;
						}
					}

					if(tempCount == 0){
						sentence.answerWrong = true;
						
					}
				}
			}

			for(var i = 0; i < sentence.words2.length; ++i){

				if(sentence.clicked2[i] == true){
					var tempCount = 0;
					for(var j = 0; j < answers.adjectives.length; ++j){

						if(sentence.words2[i] == answers.adjectives[j]){
							++tempCount;
							++sentence.correct;
						}
					}

					if(tempCount == 0){
						sentence.answerWrong = true;
						
					}
				}
			}
		}
		
		if(sentence.problemCount % 3 == 0){

			if(sentence.answerWrong || sentence.correct < 2)
				context.drawImage(errorMark,0,0,50,50,590,480,50,50);
    		else
    			context.drawImage(checkMark,0,0,50,50,590,483,50,50);
		}
    	//incorrect word is clicked
    	else if(sentence.answerWrong || sentence.correct < 3)
    		context.drawImage(errorMark,0,0,50,50,590,480,50,50);
    	//enough correct answers clicked
    	else
    		context.drawImage(checkMark,0,0,50,50,590,483,50,50);
    		
    	++sentence.problemCount;
    	sentence.correct = 0;

    
    	window.setTimeout(function(){

    		context.clearRect(0,0,canvas.width, canvas.height);
    		initializeClicked();
    		displaySentence();
    		buttonOff.onload();
    	
    	},1000);	
}

/*
    gives rounded corners to drawn rectangles
    x and y are the starting points for the top left of the passed in rectangle
    bx and by are the ending points for the bottom right of the rectangle
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