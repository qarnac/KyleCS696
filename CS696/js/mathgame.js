        // updated 9/11

        var drawingCanvas = document.getElementById('myCanvas'), context = drawingCanvas.getContext('2d'), difficulty = new Image();

        /*
          Draws from the difficulty sprite sheet the three level types to the canvas
        */
        difficulty.onload = function(myImage, xpos, ypos, cxpos, cypos){

                context.drawImage(difficulty,0,0,480,100,240,134,480,100);
                context.drawImage(difficulty,0,100,480,100,240,334,480,100);
                context.drawImage(difficulty,0,200,480,100,240,534,480,100);
        }
        difficulty.src = "../img/difficulty.png";
            
        /*
          begins a countdown from 3 once a difficulty level has been clicked
        */
        function startItUp(){

            var seconds = 2;
            context.clearRect(0,0,drawingCanvas.width, drawingCanvas.height);
            context.font = 'italic 50pt Calibri';
            context.fillText('...3', 430, 385);

            start = setInterval(function(){
                context.clearRect(0,0,drawingCanvas.width, drawingCanvas.height);
                context.font = 'italic 50pt Calibri';
                context.fillText('...'+seconds, 430, 385);
                --seconds;
                if(seconds == -1){
                    stopTimer();
                    runGame(); //after 3 seconds of notifying the player, start the game
                }
            },1000); // executes every 1000 milliseconds(i.e 1 sec)
        }

        /*
          clears the start interval in order to eliminate drawing the countdown to the canvas
        */
        function stopTimer(){
            clearInterval(start);
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

        var canvas = document.getElementById('myCanvas');
        var context = canvas.getContext('2d');

        var easy = {left:240,right:720,top:134,bottom:234};
        var intermediate = {left:240,right:720,top:334,bottom:434};
        var hard = {left:240,right:720,top:534,bottom:634};
        
        /*
          return true of false if the mouse has clicked or hovered over the passed in level
        */
        function clickedOrHover(mousePos,level){

            if(mousePos.x >= level.left && mousePos.x <= level.right && mousePos.y >= level.top && mousePos.y <= level.bottom)
                return true;
            return false;
        }

        /*
          fires whenever the mouse is clicked
        */
        canvas.addEventListener('mousedown', function(evt) {

            var mousePos = getMousePos(canvas, evt);

            //checks if easy difficulty clicked, if it is, then remove the event listeners
            if(clickedOrHover(mousePos, easy)){
                this.removeEventListener('mousedown',arguments.callee,false);
                clearMouseAndStart(evt);
            }
            //checks if easy difficulty clicked, if it is, then remove the event listeners
            else if(clickedOrHover(mousePos, intermediate)){
                this.removeEventListener('mousedown',arguments.callee,false);
                clearMouseAndStart(evt);
            }
            //checks if easy difficulty clicked, if it is, then remove the event listeners
            else if(clickedOrHover(mousePos, hard)){
                this.removeEventListener('mousedown',arguments.callee,false);
                clearMouseAndStart(evt);
            }

        }, false);

        /*
          removes the event listener for mousemove
        */
        function clearMouseAndStart(evt){

            canvas.removeEventListener('mousemove',movemouse);
            evt.target.style.cursor = 'default';
            startItUp();
        }

        canvas.addEventListener('mousemove', movemouse); 

        /*
          every instance of a cursor movement will cause this function to fire
        */
        function movemouse(evt){

            var mousePos = getMousePos(canvas, evt);
    
            evt.target.style.cursor = 'default';
    
            //checks if easy difficulty is hovered
            if(clickedOrHover(mousePos, easy)){
                evt.target.style.cursor = 'pointer';
            }
            //checks if intermediate difficulty is hovered
            else if(clickedOrHover(mousePos, intermediate)){
                evt.target.style.cursor = 'pointer';
            }
            //checks if hard difficulty is hovered
            else if(clickedOrHover(mousePos, hard)){
                evt.target.style.cursor = 'pointer';
            }
        }

        /*
          gives rounded corners to drawn rectangles
          answer.x and answer.y are the starting points for the top left of the passed in rectangle
          answer.bx and answer.by are the ending points for the bottom right of the rectangle
          r represents the radius of the corners
        */
        CanvasRenderingContext2D.prototype.roundRect = function(answer,r) {

            var r2d = Math.PI/180;
            
            this.beginPath();
            this.moveTo(answer.x+r,answer.y);
            this.lineTo(answer.bx-r,answer.y);
            this.arc(answer.bx-r,answer.y+r,r,r2d*270,r2d*360,false);
            this.lineTo(answer.bx,answer.by-r);
            this.arc(answer.bx-r,answer.by-r,r,r2d*0,r2d*90,false);
            this.lineTo(answer.x+r,answer.by);
            this.arc(answer.x+r,answer.by-r,r,r2d*90,r2d*180,false);
            this.lineTo(answer.x,answer.y+r);
            this.arc(answer.x+r,answer.y+r,r,r2d*180,r2d*270,false);
            this.closePath();
            this.strokeStyle = "#000";
            this.font = "20pt sans-serif";
            this.stroke();
        }

        /*
          begin the math game
        */
        function runGame(){

            var muncher = {image:new Image(),xpos:0,ypos:0,direction:"right",framesize:64};
            var gameboard = {cxpos:448, cypos:320,framesize:64};

            context.clearRect(0,0,drawingCanvas.width, drawingCanvas.height);

            function loadMuncher(xpos, ypos, cxpos, cypos){
                context.drawImage(muncher.image,xpos,ypos,muncher.framesize,muncher.framesize,cxpos,cypos,gameboard.framesize,gameboard.framesize);
            };
            muncher.image.src = "../img/spritesheet.png";
       
            //answer positions on gameboard
            var answer1 = {x:0, y:0, bx:0, by:0};
            var answer2 = {x:0, y:0, bx:0, by:0};
            var answer3 = {x:0, y:0, bx:0, by:0};
            var answer4 = {x:0, y:0, bx:0, by:0};

            function getRandomPosFirstLoop(){

                if(randomFromInterval(0, 1) == 1)
                   answer1.x = randomFromInterval(2, 3);
                else{
                    answer1.x = randomFromInterval(11, 12);
                }

                if(randomFromInterval(0, 1) == 1)
                   answer1.y = randomFromInterval(2, 3);
                else{
                    answer1.y = randomFromInterval(8, 9);
                }
            
                answer2.x = answer1.x; 
                answer2.y = answer1.y;
               
                //randomly finds an answer2 position away from answer1
                while(answer1.x == answer2.x || answer1.x == answer2.x + 1 || answer1.x == answer2.x - 1 && answer1.y == answer2.y || answer1.y == answer2.y + 1 || answer1.y == answer2.y - 1){

                    if(randomFromInterval(0, 1) == 1)
                        answer2.x = randomFromInterval(2, 3);
                    else{
                        answer2.x = randomFromInterval(11, 12);
                    }

                    if(randomFromInterval(0, 1) == 1)
                        answer2.y = randomFromInterval(2, 3);
                    else{
                        answer2.y = randomFromInterval(8, 9);
                    }
                }
                
                answer3.x = answer2.x;
                answer3.y = answer2.y;

                //randomly finds an answer3 position away from answer1 and answer2
                while( (answer1.x == answer3.x || answer1.x == answer3.x + 1 || answer1.x == answer3.x - 1) && (answer1.y == answer3.y || answer1.y == answer3.y + 1 || answer1.y == answer3.y - 1) ||
                       (answer2.x == answer3.x || answer2.x == answer3.x + 1 || answer2.x == answer3.x - 1) && (answer2.y == answer3.y || answer2.y == answer3.y + 1 || answer2.y == answer3.y - 1) ){

                    if(randomFromInterval(0, 1) == 1)
                        answer3.x = randomFromInterval(2, 3);
                    else{
                        answer3.x = randomFromInterval(11, 12);
                    }

                    if(randomFromInterval(0, 1) == 1)
                        answer3.y = randomFromInterval(2, 3);
                    else{
                        answer3.y = randomFromInterval(8, 9);
                    }
                }
                
                answer4.x = answer3.x;
                answer4.y = answer3.y;

                //randomly finds an answer4 position away from answer1, answer2, and answer3
                while( (answer1.x == answer4.x || answer1.x == answer4.x + 1 || answer1.x == answer4.x - 1) && (answer1.y == answer4.y || answer1.y == answer4.y + 1 || answer1.y == answer4.y - 1) ||
                       (answer2.x == answer4.x || answer2.x == answer4.x + 1 || answer2.x == answer4.x - 1) && (answer2.y == answer4.y || answer2.y == answer4.y + 1 || answer2.y == answer4.y - 1) ||
                       (answer3.x == answer4.x || answer3.x == answer4.x + 1 || answer3.x == answer4.x - 1) && (answer3.y == answer4.y || answer3.y == answer4.y + 1 || answer3.y == answer4.y - 1) ){

                    if(randomFromInterval(0, 1) == 1)
                        answer4.x = randomFromInterval(2, 3);
                    else{
                        answer4.x = randomFromInterval(11, 12);
                    }

                    if(randomFromInterval(0, 1) == 1)
                        answer4.y = randomFromInterval(2, 3);
                    else{
                        answer4.y = randomFromInterval(8, 9);
                    }
                }
                
                answer1.x = (64 * answer1.x) + 1;
                answer1.y = (64 * answer1.y) + 1;
                answer1.bx = answer1.x + 62;
                answer1.by = answer1.y + 62;

                answer2.x = (64 * answer2.x) + 1;
                answer2.y = (64 * answer2.y) + 1;
                answer2.bx = answer2.x + 62;
                answer2.by = answer2.y + 62;
                
                answer3.x = (64 * answer3.x) + 1;
                answer3.y = (64 * answer3.y) + 1;
                answer3.bx = answer3.x + 62;
                answer3.by = answer3.y + 62;

                answer4.x = (64 * answer4.x) + 1;
                answer4.y = (64 * answer4.y) + 1;
                answer4.bx = answer4.x + 62;
                answer4.by = answer4.y + 62;
            }

            function drawAnswers(){

                context.roundRect(answer1, 5);
                context.roundRect(answer2, 5);
                context.roundRect(answer3, 5);
                context.roundRect(answer4, 5);
                
                context.fillText("1", answer1.x + 23, answer1.y + 41);
                context.fillText("2", answer2.x + 23, answer2.y + 41);
                context.fillText("3", answer3.x + 23, answer3.y + 41);
                context.fillText("4", answer4.x + 23, answer4.y + 41);
            }

            function randomFromInterval(from,to){

                return Math.floor(Math.random()*(to-from+1)+from);
            }

            getRandomPosFirstLoop();

			function gameLoop(){

        		context.clearRect(0,0,drawingCanvas.width, drawingCanvas.height);

                drawAnswers();

        		if(muncher.direction == "left"){
        			gameboard.cxpos -= 64;

					if(muncher.xpos == 64 && muncher.ypos == 64){
        				muncher.xpos = 128;
        			}
        			else{
        				muncher.xpos = 64;
        			}
        		}
        		else if(muncher.direction == "right"){
        			gameboard.cxpos += 64;

        			if(muncher.xpos == 0 && muncher.ypos == 0){
        				muncher.xpos = 128;
        			}
        			else{
        				muncher.xpos = 0;
        			}
        		}
        		else if(muncher.direction == "up"){
        			gameboard.cypos -= 64;

        			if(muncher.xpos == 0 && muncher.ypos == 192){
        				muncher.xpos = 128;
        			}
        			else{
        				muncher.xpos = 0;
        			}
        		}
        		else{
        			gameboard.cypos += 64;

        			if(muncher.xpos == 0 && muncher.ypos == 128){
        				muncher.xpos = 128;
        			}
        			else{
        				muncher.xpos = 0;
        			}
        		}

        		document.onkeydown = function(evt){

        			evt = evt || window.event;
        			switch(evt.keyCode){
        				case 37:
        				    
        				    if(muncher.direction != "left"){
        				    	muncher.xpos = 64;
        				    	muncher.ypos = 64;
        				    }
        					muncher.direction = "left";
        					break;

        				case 38:

        					if(muncher.direction != "up"){
        				    	muncher.xpos = 0;
        				    	muncher.ypos = 192;
        				    }
        					muncher.direction = "up";
        					break;

        				case 39:

        					if(muncher.direction != "right"){
        				    	muncher.xpos = 0;
        				    	muncher.ypos = 0;
        				    }			
        					muncher.direction = "right";
        					break;

        				case 40:

        					if(muncher.direction != "down"){
        				    	muncher.xpos = 0;
        				    	muncher.ypos = 128;
        				    }    				
        					muncher.direction = "down";
        					break;
        			}
        		}
                loadMuncher(muncher.xpos, muncher.ypos, gameboard.cxpos, gameboard.cypos); //reload image to new position on the gameboard
        	}
        	setInterval(gameLoop,800);
        } 