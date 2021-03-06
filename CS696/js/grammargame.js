var canvas = document.getElementById('myCanvas'), context = canvas.getContext('2d');

var progMeter = 0;
var total_width = 300;
var total_height = 34;
var initial_x = 345;
var initial_y = 150;
var radius = total_height/2;

var tryAgain = false;
// Create gradient
var grd = context.createLinearGradient(0,0,960,0);
grd.addColorStop(0,"Maroon");
grd.addColorStop(1,"white");

var problem = "";

var buttonOff = new Image();
buttonOff.onload = function(){
	context.drawImage(buttonOff,0,0,81,48,440,480,81,48);
};
buttonOff.src = "../img/buttonOff.png";

var buttonOn = new Image();
buttonOn.src = "../img/buttonOn.png";

var checkMark = new Image();
checkMark.src = "../img/checkMark.png";

var errorMark = new Image();
errorMark.src = "../img/errorMark.png";

var restartOff = new Image();
restartOff.src = "../img/restartOff.png";

var restartOn = new Image();
restartOn.src = "../img/restartOn.png";

var canvas2 = document.getElementById('canvas2'), context2 = canvas2.getContext('2d');

context2.beginPath();
context2.strokeStyle = '#99CC33';
context2.lineCap = 'square';
context2.closePath();
context2.fill();
context2.lineWidth = 10.0;

var imd = null;
imd = context2.getImageData(0,0,240,240);

var countdown, myVar, angle, totalScore = 0, totalCorrect = 0;
progressLayerRect(initial_x, initial_y, total_width, total_height, radius);
progressBarRect(initial_x, initial_y, progMeter, total_height, radius, total_width);
progressText(initial_x, initial_y, progMeter);

canvas.addEventListener('mousedown', mousedown);
canvas.addEventListener('mousemove', movemouse); 

startTimer();
//begin the countdown timer...60 second duration
function startTimer(){
	countdown = 60;
	angle = 1.499999999;
	context2.font="40px Sans-Serif";
	context2.fillText(countdown,68,93);
	drawProgress(angle);
	--countdown;
	start = setInterval(function(){
       
		drawProgress(angle);
		if(angle == .0666666666)
		angle = 0;
		context2.font="40px Sans-Serif";
		if(countdown < 10)
			context2.fillText(countdown,80,93);
		else
			context2.fillText(countdown,68,93);
		--countdown;
		if(countdown == -1){
			clearInterval(start);
			context2.clearRect(0,0,canvas2.width, canvas2.height);
			context.drawImage(errorMark,0,0,50,50,590,480,50,50);
    		++sentence.problemCount;
    		document.getElementById('fail').play();
    		displayNextProblem();
		}
    },1000); // executes every 1000 milliseconds(i.e 1 sec)
}
//sentence object contains both the parsed words, widths, heights, starting points, and ending points
var sentence = {words1:[""], words2:[""], wordwidths1:[], wordwidths2:[], clicked1:[], clicked2:[], picked:[],  
	 		    startingPoint1xpos:[], startingPoint2xpos:[],
	 		    endingPoint1xpos:[], endingPoint2xpos:[], 
	 		    startingPoint1ypos:298, startingPoint2ypos:368,
	 		    endingPoint1ypos:340, endingPoint2ypos: 410,
	 		    startLine1:0, startLine2:0,
	 		    line1: "", line2:"",
	 		    correct: 0, answerWrong: false, problemCount: 1, clickCount: 0
	 		};
//answers object contains string arrays for each problem type
var answers = {nouns:[""],verbs:[""],adjectives:[""]};

for(var i = 0; i < 5; ++i)
	sentence.picked[i] = false;

var random = getRandomInt(0, 4);
pickRandomSentence(random);
//draw the entire progress bar
function drawProgress(current) {
    context2.putImageData(imd, 0, 0);
    context2.beginPath();
    context2.arc(90, 80, 60, 1.499999999 * Math.PI, Math.PI * current, true);
    context2.stroke();
    angle += .0333333333;
}
//provide round rectangles to the progress bar
function rndRect(x, y, width, height, radius) {
    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + width - radius, y);
    context.arc(x+width-radius, y+radius, radius, -Math.PI/2, Math.PI/2, false);
    context.lineTo(x + radius, y + height);
    context.arc(x+radius, y+radius, radius, Math.PI/2, 3*Math.PI/2, false);
    context.closePath();
    context.fill();
}
//provide different colored layers in the progress bar 
function progressLayerRect(x, y, width, height, radius) {
    context.save();
     // first grey layer
    context.fillStyle = 'rgba(189,189,189,1)';
    rndRect(x, y, width, height, radius);
    // second layer with gradient
    var lingrad = context.createLinearGradient(0,y+height,0,0);
    lingrad.addColorStop(0, 'rgba(255,255,255, 0.1)');
    lingrad.addColorStop(0.4, 'rgba(255,255,255, 0.7)');
    lingrad.addColorStop(1, 'rgba(255,255,255,0.4)');
    context.fillStyle = lingrad;
    rndRect(x, y, width, height, radius);
    context.restore();
}
//draw the progress within the progress bar
function progressBarRect(x, y, width, height, radius, max) {
    // deplacement for chord drawing
    var offset = 0;
    context.beginPath();
    if (width<radius) {
        offset = radius - Math.sqrt(Math.pow(radius,2)-Math.pow((radius-width),2));
        // Left angle
        var left_angle = Math.acos((radius - width) / radius);
        context.moveTo(x + width, y+offset);
        context.lineTo(x + width, y+height-offset);
        context.arc(x + radius, y + radius, radius, Math.PI - left_angle, Math.PI + left_angle, false);
    }
    else if (width+radius>max) {
        offset = radius - Math.sqrt(Math.pow(radius,2)-Math.pow((radius - (max-width)),2));
        // Right angle
        var right_angle = Math.acos((radius - (max-width)) / radius);
        context.moveTo(x + radius, y);
        context.lineTo(x + width, y);
        context.arc(x+max-radius, y + radius, radius, -Math.PI/2, -right_angle, false);
        context.lineTo(x + width, y+height-offset);
        context.arc(x+max-radius, y + radius, radius, right_angle, Math.PI/2, false);
        context.lineTo(x + radius, y + height);
        context.arc(x+radius, y+radius, radius, Math.PI/2, 3*Math.PI/2, false);
    }
    else {
        context.moveTo(x + radius, y);
        context.lineTo(x + width, y);
        context.lineTo(x + width, y + height);
        context.lineTo(x + radius, y + height);
        context.arc(x+radius, y+radius, radius, Math.PI/2, 3*Math.PI/2, false);
    }
    context.closePath();
    context.fillStyle = 'green';
    context.fill();  
}
//draw the % completed in the progress bar
function progressText(x,y,width) {
    context.save();
    context.fillStyle = 'white';
    var text = Math.floor(width/total_width*100)+"%";
   
    context.font = "20px Arial";
    context.fillText(text, initial_x+14, y+25);
    context.restore();
}
//returns a random integer between two passed in integers
function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}   
//returns the mouse position of the cursor in the canvas
function getMousePos(canvas, evt) {
     var rect = canvas.getBoundingClientRect();
     return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
    };
}
//every instance of a cursor movement will cause this function to fire  
function movemouse(evt){
	var mousePos = getMousePos(canvas, evt);
  
    checkIfHovered(sentence.words1.length, mousePos, sentence.startingPoint1xpos, sentence.endingPoint1xpos, sentence.startingPoint1ypos, sentence.endingPoint1ypos, sentence.clicked1);
    checkIfHovered(sentence.words2.length, mousePos, sentence.startingPoint2xpos, sentence.endingPoint2xpos, sentence.startingPoint2ypos, sentence.endingPoint2ypos, sentence.clicked2);

    if(mousePos.x >= 440 && mousePos.x <= 521 && mousePos.y >= 480 && mousePos.y <= 528){
    	context.drawImage(buttonOn,0,0,81,48,440,480,81,48);
    }
    else
    	buttonOff.onload();

    progressLayerRect(initial_x, initial_y, total_width, total_height, radius);
	progressBarRect(initial_x, initial_y, progMeter, total_height, radius, total_width);
	progressText(initial_x, initial_y, progMeter, total_height, radius, total_width);
}
//check if the words are hovered by the mouse cursor
function checkIfHovered(len, mousePos, startingPointX, endingPointX, startingPointY, endingPointY, clicked){
    for(var i = 0; i < len; ++i){
    	if(mousePos.x >= startingPointX[i] && mousePos.x <= endingPointX[i] && mousePos.y >= startingPointY && mousePos.y <= endingPointY && clicked[i] == false)
           	context.roundRect(startingPointX[i], startingPointY, endingPointX[i], endingPointY, "blue", 5);
		else if(mousePos.x >= startingPointX[i] && mousePos.x <= endingPointX[i] && mousePos.y >= startingPointY && mousePos.y <= endingPointY || clicked[i] == true)
			context.roundRect(startingPointX[i], startingPointY, endingPointX[i], endingPointY, "red", 5);
		else
           	context.roundRect(startingPointX[i], startingPointY, endingPointX[i], endingPointY, "white", 5);	
    }
}
//fires whenever mouse is clicked 
function mousedown(evt){
	if(tryAgain){
		context.clearRect(0,0,canvas.width, canvas.height);
    	displaySentence();
    	displayScore();
    	buttonOff.onload();
	}
	tryAgain = false;
    var mousePos = getMousePos(canvas, evt);
            
    checkMouseDown(sentence.words1.length, mousePos, sentence.startingPoint1xpos, sentence.endingPoint1xpos, sentence.startingPoint1ypos, sentence.endingPoint1ypos, sentence.clicked1);
    checkMouseDown(sentence.words2.length, mousePos, sentence.startingPoint2xpos, sentence.endingPoint2xpos, sentence.startingPoint2ypos, sentence.endingPoint2ypos, sentence.clicked2);

    if(mousePos.x >= 450 && mousePos.x <= 531 && mousePos.y >= 480 && mousePos.y <= 528)
    	doneClicked();
    
    progressLayerRect(initial_x, initial_y, total_width, total_height, radius);
	progressBarRect(initial_x, initial_y, progMeter, total_height, radius, total_width);
	progressText(initial_x, initial_y, progMeter, total_height, radius, total_width);
}
//check if a word has been clicked in the sentence
function checkMouseDown(len, mousePos, startingPointX, endingPointX, startingPointY, endingPointY, clicked){
	for(var i = 0; i < len; ++i){
        if(mousePos.x >= startingPointX[i] && mousePos.x <= endingPointX[i] && mousePos.y >= startingPointY && mousePos.y <= endingPointY && clicked[i] == true){
           	clicked[i] = false;
			context.roundRect(startingPointX[i], startingPointY, endingPointX[i], endingPointY, "white", 5);
			document.getElementById('clickOut').play();
        }
        else if(mousePos.x >= startingPointX[i] && mousePos.x <= endingPointX[i] && mousePos.y >= startingPointY && mousePos.y <= endingPointY && clicked[i] == false){
           	clicked[i] = true;
           	context.roundRect(startingPointX[i], startingPointY, endingPointX[i], endingPointY, "red", 5);
           	document.getElementById('clickIn').play();
        }
    }
}
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
	if(sentence.problemCount % 3 == 1)
		grd.addColorStop(0,"Maroon");
	else if(sentence.problemCount % 3 == 2)
		grd.addColorStop(0,"darkBlue");
	else
		grd.addColorStop(0,"darkGreen");

	context.fillStyle=grd;
	context.fillRect(0,0,960,63);
	context.font = "50px Arial";
	context.fillStyle = 'white';

	if(sentence.problemCount % 3 == 1){
		problem = "Click on three nouns";
		context.fillText(problem, 250, 50);
	}
	else if(sentence.problemCount % 3 == 2){
		problem = "Click on three verbs";
		context.fillText(problem, 257, 50);
	}
	else{
		problem = "Click on two adjectives";
		context.fillText(problem, 226, 50);
	}
}
//initialize each word in the sentence as not being clicked to begin each problem
function initializeClicked(){
	for(var i = 0; i < sentence.words1.length; ++i)
		sentence.clicked1[i] = false;
	for(var i = 0; i < sentence.words2.length; ++i)
		sentence.clicked2[i] = false;
}
//passes information for each line to calculate the word widths and starting points
function wordWidthsAndPoints(){
	calculateWordWidthsAndPoints(sentence.words1.length, sentence.startingPoint1xpos, sentence.endingPoint1xpos, sentence.startLine1, sentence.wordwidths1, sentence.words1);
	calculateWordWidthsAndPoints(sentence.words2.length, sentence.startingPoint2xpos, sentence.endingPoint2xpos, sentence.startLine2, sentence.wordwidths2, sentence.words2);
}
//calculates the widths of each word in the line1 and line2 and the starting points, removes commas and periods from the widths 
function calculateWordWidthsAndPoints(len, startingPoint, endingPoint, startLine, wordwidth, words){
	var currentPoint = startLine;
	for(var i = 0; i < len; ++i){
		wordwidth[i] = measureText(words[i], 40, 'Arial').width;
		startingPoint[i] = currentPoint - 2;
		if(words[i].charAt(words[i].length - 1) == ',' || words[i].charAt(words[i].length - 1) == '.'){
			wordwidth[i] -= 11;
			currentPoint += wordwidth[i] + 22;
		}
		else
			currentPoint += wordwidth[i] + 11;
		endingPoint[i] = startingPoint[i] + wordwidth[i] + 4;
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

    lDiv.innerHTML = pText;

    var lResult = {
        width: lDiv.clientWidth,
        height: lDiv.clientHeight
    };
    document.body.removeChild(lDiv);
    lDiv = null;
    return lResult;
}
//checks if the words selected are correct for that specific problem
function checkAnswers(wordLen, clicked, posLen, words, pos){
	for(var i = 0; i < wordLen; ++i){
		if(clicked[i] == true){
			var tempCount = 0;
			for(var j = 0; j < posLen; ++j){
				if(words[i] == pos[j]){
					++tempCount;
					++sentence.correct;
				}
			}
			if(tempCount == 0)
				sentence.answerWrong = true;	
		}
	}
}
//totals the number of clicked words per line
function checkIfClicked(len, clicked){
	for(var i = 0; i < len; ++i){
		if(clicked[i]){
			++sentence.clickCount;
			break;
		}
	}	
}
//once user presses the done button perform various checks in order to advance to next problem
function doneClicked(){
	sentence.answerWrong = false;
	//nouns
	if(sentence.problemCount % 3 == 1){
		checkAnswers(sentence.words1.length, sentence.clicked1, answers.nouns.length, sentence.words1, answers.nouns);
		checkAnswers(sentence.words2.length, sentence.clicked2, answers.nouns.length, sentence.words2, answers.nouns);
	}
	//verbs
	else if(sentence.problemCount % 3 == 2){
		checkAnswers(sentence.words1.length, sentence.clicked1, answers.verbs.length, sentence.words1, answers.verbs);
		checkAnswers(sentence.words2.length, sentence.clicked2, answers.verbs.length, sentence.words2, answers.verbs);
	}
	//adjectives
	else{
		checkAnswers(sentence.words1.length, sentence.clicked1, answers.adjectives.length, sentence.words1, answers.adjectives);
		checkAnswers(sentence.words2.length, sentence.clicked2, answers.adjectives.length, sentence.words2, answers.adjectives);
	}

	checkIfClicked(sentence.words1.length, sentence.clicked1);
	checkIfClicked(sentence.words2.length, sentence.clicked2);
	context.font = "20px Arial";
	context.fillStyle = 'darkRed';
	//Determines if there are no words clicked, then display try again message
	if(sentence.clickCount == 0){
		context.fillText("No words selected, try again!", 351, 580);
		tryAgain = true;
	}
	//For adjective problems
	else if(sentence.problemCount % 3 == 0){
		if(!sentence.answerWrong && sentence.correct == 1){
			context.fillText("Select one more adjective!", 363.5, 580);
			tryAgain = true;
		}
		else if(sentence.answerWrong || sentence.correct < 2)
			incorrect();
    	else
    		correct();
	}
	//For noun and verb problems
    else if(!sentence.answerWrong && sentence.correct == 1) {
		context.fillText("One correct, select two more!", 351, 580);
		tryAgain = true;
    }
    else if(!sentence.answerWrong && sentence.correct == 2) {
		context.fillText("Two correct, select one more!", 351, 580);
		tryAgain = true;
    }
    else if(sentence.answerWrong || sentence.correct < 3)
    	incorrect();
    else
    	correct();
    sentence.correct = 0;
    sentence.clickCount = 0;

    //If user is correct or incorrect then display next problem
    if(!tryAgain)
    	displayNextProblem(); 	
}
//user is incorrect
function incorrect(){
	context.drawImage(errorMark,0,0,50,50,590,480,50,50);
	++sentence.problemCount;
	document.getElementById('fail').play();
}
//user is correct
function correct(){
	context.drawImage(checkMark,0,0,50,50,590,483,50,50);
    ++sentence.problemCount;
    ++totalCorrect;
    document.getElementById('cash').play();
    displayPoints();
}
//display the points awarded after each correct answer
function displayPoints(){
	context.font="40px Sans-Serif";
	context.fillStyle = 'darkGreen';
	var tempScore = Math.floor(countdown/10) * 10;
	if(tempScore >= 10){
		context.fillText("+" + tempScore,650,520);
		totalScore += tempScore;
	}
	else{
		context.fillText("+" + 5,650,520);				
		totalScore += 5;
	}
}
//display the total score in upper left corner
function displayScore(){
	context.font="40px Sans-Serif";
	context.fillStyle = '#99CC33';
	context.fillText("Score: " + totalScore,0,100);
}
//display the next problem after 1300 ms delay to provide the user feedback
function displayNextProblem(){
	clearInterval(start);
	context2.clearRect(0,0,canvas2.width, canvas2.height);
	canvas.removeEventListener('mousemove',movemouse);
    canvas.removeEventListener('mousedown',mousedown);

	window.setTimeout(function(){

    	context.clearRect(0,0,canvas.width, canvas.height);

    	if(sentence.problemCount == 16){

    		canvas.addEventListener('mousemove', over);
    		canvas.addEventListener('mousedown', down); 
		
			context.drawImage(restartOff,0,0,81,48,440,555,81,48);

    		context.font="60px Sans-Serif";
			context.fillStyle = '#99CC33';
			context.fillText("Game Over",322,300);

			context.font="50px Sans-Serif";
			context.fillStyle = 'black';
			if(totalScore < 100)
				context.fillText("Total Score: " + totalScore, 317,400);
			else
				context.fillText("Total Score: " + totalScore, 300,400);
			
			if(totalCorrect < 10)
				context.fillText("Questions Correct: " + totalCorrect + "/" + (sentence.problemCount-1),210,500);
			else
				context.fillText("Questions Correct: " + totalCorrect + "/" + (sentence.problemCount-1),196,500);
    	}
    	else{
    		if(sentence.problemCount % 3 == 1){
    			var random = getRandomInt(0, 4);
				pickRandomSentence(random);
    		}
    		else{
    			initializeClicked();
    			displaySentence();
    			displayScore();
    		}
    		
    		progMeter += 20;
    		progressLayerRect(initial_x, initial_y, total_width, total_height, radius);
			progressBarRect(initial_x, initial_y, progMeter, total_height, radius, total_width);
			progressText(initial_x, initial_y, progMeter, total_height, radius, total_width);
    		buttonOff.onload();
    		context2.clearRect(0,0,canvas2.width, canvas2.height);
    		startTimer();
    		canvas.addEventListener('mousemove', movemouse);
    		canvas.addEventListener('mousedown', mousedown); 
    	}
    },1300);
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
    this.stroke();
};
//a sentence is randomly chosen for each problem; no duplicated problems throughout the game
function pickRandomSentence(random){

	while(sentence.picked[random] == true)
		random = getRandomInt(0, 4);
	//initialize the lines for the sentence
	if(random == 0){
		sentence.line1 = "Once the shiny gates opened, Jimmy ran to wait in";
		sentence.line2 = "line for the scariest ride at Disneyland.";
		answers.nouns = ["gates", "Jimmy", "line", "ride", "Disneyland."];
		answers.verbs = ["opened,", "ran", "wait"];
		answers.adjectives = ["shiny", "scariest"];
	}
	else if(random == 1){
		sentence.line1 = "Sally drove to the brand-new supermarket";
		sentence.line2 = "to purchase a delicious cake that she ordered.";
		answers.nouns = ["Sally", "supermarket", "cake"];
		answers.verbs = ["drove", "purchase", "ordered."];
		answers.adjectives = ["brand-new", "delicious"];
	}
	else if(random == 2){
		sentence.line1 = "The annoyed busman hit the brakes to frighten";
		sentence.line2 = "the screaming kids playing in the back of the bus.";
		answers.nouns = ["busman", "brakes", "kids", "back", "bus."];
		answers.verbs = ["hit", "frighten", "playing"];
		answers.adjectives = ["annoyed", "screaming"];
	}
	else if(random == 3){
		sentence.line1 = "The brave sailor safely swam away from danger after";
		sentence.line2 = "pirates destroyed the boat that belonged to the crew.";
		answers.nouns = ["sailor", "danger", "pirates", "boat", "crew."];
		answers.verbs = ["swam", "destroyed", "belonged"];
		answers.adjectives = ["brave", "safely"];
	}
	else if(random == 4){
		sentence.line1 = "My Mom panicked and shouted for assistance when";
		sentence.line2 = "a dark, hairy spider scurried across the carpet.";
		answers.nouns = ["Mom", "assistance", "spider", "carpet."];
		answers.verbs = ["panicked", "shouted", "scurried"];
		answers.adjectives = ["dark,", "hairy"];
	}
	sentence.picked[random] = true;
	parseSentence();
	initializeClicked();
	calculateBegEnd();
	wordWidthsAndPoints();
	displaySentence();
	displayScore();
}
//checks if the user has clicked the restart button
function down(evt){
	var mousePos = getMousePos(canvas, evt);
	if(mousePos.x >= 440 && mousePos.x <= 521 && mousePos.y >= 555 && mousePos.y <= 603){
		canvas.removeEventListener('mousemove',over);
    	canvas.removeEventListener('mousedown',down);
    	context.clearRect(0,0,canvas.width, canvas.height);
    	window.location.reload();
	}	
}
//checks if the user has move their mouse cursor over the restart button
function over(evt){
	var mousePos = getMousePos(canvas, evt);
	if(mousePos.x >= 440 && mousePos.x <= 521 && mousePos.y >= 555 && mousePos.y <= 603)
		context.drawImage(restartOn,0,0,81,48,440,555,81,48);
	else
		context.drawImage(restartOff,0,0,81,48,440,555,81,48);
} 