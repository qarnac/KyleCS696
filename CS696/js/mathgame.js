        var canvas = document.getElementById('myCanvas'), context = canvas.getContext('2d'), difficulty = new Image(), restart = new Image();

        begin();

        function begin(){

        /*
          Draws from the difficulty sprite sheet the three level types to the canvas
        */
        difficulty.onload = function(){

                context.drawImage(difficulty,0,0,480,100,240,134,480,100);
                context.drawImage(difficulty,0,100,480,100,240,334,480,100);
                context.drawImage(difficulty,0,200,480,100,240,534,480,100);
        };
        difficulty.src = "../img/difficulty.png";

        difficulty.onload();
  
        /*
          begins a countdown from 3 once a difficulty level has been clicked
        */
        function startItUp(){

            var seconds = 2;
            context.clearRect(0,0,canvas.width, canvas.height);
            context.font = 'italic 50pt Calibri';
            context.fillText('...3', 430, 385);

            start = setInterval(function(){
                context.clearRect(0,0,canvas.width, canvas.height);
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

        var easy = {left:240,right:720,top:134,bottom:234,clicked:false};
        var intermediate = {left:240,right:720,top:334,bottom:434,clicked:false};
        var hard = {left:240,right:720,top:534,bottom:634,clicked:false};

        var restartGame = {left:240,right:720,top:380,bottom:480};
        var newLevel = {left:240,right:720,top:520,bottom:620};
        
        /*
          return true of false if the mouse has clicked or hovered over the passed in level
        */
        function clickedOrHover(mousePos,level){

            if(mousePos.x >= level.left && mousePos.x <= level.right && mousePos.y >= level.top && mousePos.y <= level.bottom)
                return true;
            return false;
        }

        canvas.addEventListener('mousedown', mousedown); 
        /*
          fires whenever mouse is clicked on opening screen
        */
        function mousedown(evt){

            var mousePos = getMousePos(canvas, evt);

            //checks if easy difficulty clicked, if it is, then remove the event listeners
            if(clickedOrHover(mousePos, easy)){
                this.removeEventListener('mousedown',arguments.callee,false);
                easy.clicked = true;
                clearMouseAndStart(evt);
            }
            //checks if easy difficulty clicked, if it is, then remove the event listeners
            else if(clickedOrHover(mousePos, intermediate)){
                this.removeEventListener('mousedown',arguments.callee,false);
                intermediate.clicked = true;
                clearMouseAndStart(evt);
            }
            //checks if easy difficulty clicked, if it is, then remove the event listeners
            else if(clickedOrHover(mousePos, hard)){
                this.removeEventListener('mousedown',arguments.callee,false);
                hard.clicked = true;
                clearMouseAndStart(evt);
            }
        }
        
        
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
        };

        /*
          begin the math game
        */
        function runGame(){

            var muncher = {image:new Image(),xpos:0,ypos:0,cxpos:448,cypos:320,direction:"right",framesize:64};
            var gameboard = {framesize:64};

            context.clearRect(0,0,canvas.width, canvas.height);

            function loadMuncher(xpos, ypos, cxpos, cypos){

                context.drawImage(muncher.image,xpos,ypos,muncher.framesize,muncher.framesize,muncher.cxpos,muncher.cypos,gameboard.framesize,gameboard.framesize);
            }
            muncher.image.src = "../img/spritesheet.png";
       
            //answer positions on gameboard
            var answer1 = {x:0, y:0, bx:0, by:0, text:-1};
            var answer2 = {x:0, y:0, bx:0, by:0, text:-1};
            var answer3 = {x:0, y:0, bx:0, by:0, text:-1};
            var answer4 = {x:0, y:0, bx:0, by:0, text:-1};

            function randomPos(answer){

                var num = randomFromInterval(0, 2);
                if(num == 1)
                    answer.x = randomFromInterval(2, 3);
                else if(num == 2)
                    answer.x = randomFromInterval(11, 12);
                else{
                    answer.x = randomFromInterval(6, 7);
                }

                num = randomFromInterval(0, 2);
                if(num == 1)
                    answer.y = randomFromInterval(2, 3);
                else if(num == 2)
                    answer.y = randomFromInterval(5, 6);
                else{
                    answer.y = randomFromInterval(9, 10);
                } 
            }

            function convertMovesToPixels(answer){

                answer.x = (64 * answer.x) + 1;
                answer.y = (64 * answer.y) + 1;
                answer.bx = answer.x + 62;
                answer.by = answer.y + 62;
            }

            function getNewAnswerPositions(){

                randomPos(answer1);
                randomPos(answer2);
                randomPos(answer3);
                randomPos(answer4);

                convertMovesToPixels(answer1);
                convertMovesToPixels(answer2);
                convertMovesToPixels(answer3);
                convertMovesToPixels(answer4);

                while((muncher.cxpos == answer1.x + 63 || muncher.cxpos == answer1.x - 65 || muncher.cxpos == answer1.x - 1) && (muncher.cypos == answer1.y + 63 || muncher.cypos == answer1.y - 65 || muncher.cypos == answer1.y - 1) ) {

                    randomPos(answer1);
                    convertMovesToPixels(answer1);
                }

            
                //finds a new position for answer 2 if it is adjacent to answer 1 
                while( (answer1.x == answer2.x || answer1.x == answer2.x + 64 || answer1.x == answer2.x - 64) && (answer1.y == answer2.y || answer1.y == answer2.y + 64 || answer1.y == answer2.y - 64) || 
                       (muncher.cxpos == answer2.x + 63 || muncher.cxpos == answer2.x - 65 || muncher.cxpos == answer2.x - 1) && (muncher.cypos == answer2.y + 63 || muncher.cypos == answer2.y - 65 || muncher.cypos == answer2.y - 1) ) {

                   randomPos(answer2);
                   convertMovesToPixels(answer2);
                }
                
                //finds a new position for answer 3 if it is adjacent to answer 1 or 2
                while( (answer1.x == answer3.x || answer1.x == answer3.x + 64 || answer1.x == answer3.x - 64) && (answer1.y == answer3.y || answer1.y == answer3.y + 64 || answer1.y == answer3.y - 64) ||
                       (answer2.x == answer3.x || answer2.x == answer3.x + 64 || answer2.x == answer3.x - 64) && (answer2.y == answer3.y || answer2.y == answer3.y + 64 || answer2.y == answer3.y - 64) || 
                       (muncher.cxpos == answer3.x + 63 || muncher.cxpos == answer3.x - 65 || muncher.cxpos == answer3.x - 1) && (muncher.cypos == answer3.y + 63 || muncher.cypos == answer3.y - 65 || muncher.cypos == answer3.y - 1) ){

                    randomPos(answer3);
                    convertMovesToPixels(answer3);
                }
                
               
                //finds a new position for answer 4 if it is adjacent to answer 1 or 2 or 3
                while( (answer1.x == answer4.x || answer1.x == answer4.x + 64 || answer1.x == answer4.x - 64) && (answer1.y == answer4.y || answer1.y == answer4.y + 64 || answer1.y == answer4.y - 64) ||
                       (answer2.x == answer4.x || answer2.x == answer4.x + 64 || answer2.x == answer4.x - 64) && (answer2.y == answer4.y || answer2.y == answer4.y + 64 || answer2.y == answer4.y - 64) ||
                       (answer3.x == answer4.x || answer3.x == answer4.x + 64 || answer3.x == answer4.x - 64) && (answer3.y == answer4.y || answer3.y == answer4.y + 64 || answer3.y == answer4.y - 64) || 
                       (muncher.cxpos == answer4.x + 63 || muncher.cxpos == answer4.x - 65 || muncher.cxpos == answer4.x - 1) && (muncher.cypos == answer4.y + 63 || muncher.cypos == answer4.y - 65 || muncher.cypos == answer4.y - 1) ){

                    randomPos(answer4);
                    convertMovesToPixels(answer4);
                }
            }

            function drawAnswers(){

                context.roundRect(answer1, 5);
                context.roundRect(answer2, 5);
                context.roundRect(answer3, 5);
                context.roundRect(answer4, 5);
               
                positionNum(answer1);
                positionNum(answer2);
                positionNum(answer3);
                positionNum(answer4);
            }

            function positionNum(answer){

                if(answer.text > 9){

                    context.fillText(answer.text, answer.x + 15, answer.y + 41);
                }
                else{

                    context.fillText(answer.text, answer.x + 23, answer.y + 41);
                }
            }

            function randomFromInterval(from,to){

                return Math.floor(Math.random()*(to-from+1)+from);
            }

            var question = {num1:0, num2:0}; 
            var score = 0, problemType;
            function createProblem(){

                problemType = randomFromInterval(0, 1);

                switch(problemType){
                    //addition
                    case 0: 
                        if(easy.clicked == true){

                            question.num1 = randomFromInterval(0, 6);
                            question.num2 = randomFromInterval(0, 6);
                            answer1.text = question.num1 + question.num2;
                            getIncorrectAnswers(question.num1, question.num2, 12);
                        }
                        else if(intermediate.clicked == true){

                            question.num1 = randomFromInterval(0, 9);
                            question.num2 = randomFromInterval(0, 9);
                            answer1.text = question.num1 + question.num2;
                             getIncorrectAnswers(question.num1, question.num2, 18);
                        }
                        else{

                            question.num1 = randomFromInterval(0, 12);
                            question.num2 = randomFromInterval(0, 12);
                            answer1.text = question.num1 + question.num2;
                             getIncorrectAnswers(question.num1, question.num2, 24);
                        }
                        break;
                        
                    //subtraction
                    case 1:
                         if(easy.clicked == true){

                            question.num1 = randomFromInterval(0, 8);
                            question.num2 = randomFromInterval(0, 8);

                            while(question.num2 >= question.num1){
                                question.num2 = randomFromInterval(0, 8);
                            }
                            answer1.text = question.num1 - question.num2;
                             getIncorrectAnswers(question.num1, question.num2, 8);
                        }
                        else if(intermediate.clicked == true){

                            question.num1 = randomFromInterval(0, 14);
                            question.num2 = randomFromInterval(0, 14);

                            while(question.num2 >= question.num1){
                                question.num2 = randomFromInterval(0, 14);
                            }
                            answer1.text = question.num1 - question.num2;
                             getIncorrectAnswers(question.num1, question.num2, 14);
                        }
                        else{

                            question.num1 = randomFromInterval(0, 20);
                            question.num2 = randomFromInterval(0, 20);

                            while(question.num2 >= question.num1){
                                question.num2 = randomFromInterval(0, 20);
                            }
                            answer1.text = question.num1 - question.num2;
                             getIncorrectAnswers(question.num1, question.num2, 20);
                        }
                        break;
                    /*
                    //multiplication
                    case 2:
                      
                        break;
                    //division
                    case 3:
                      
                        break;
                    //prime numbers
                    case 4:
                      
                        break; 
                        */
               }   
            }

            function getIncorrectAnswers(num1, num2, upper){

                answer2.text = randomFromInterval(0, upper);
                answer3.text = randomFromInterval(0, upper);
                answer4.text = randomFromInterval(0, upper);

                while(answer2.text == answer1.text || answer2.text == -1)
                    answer2.text = randomFromInterval(0, upper);
                while(answer3.text == answer1.text || answer3.text == answer2.text || answer3.text == -1){
                    answer3.text = randomFromInterval(0, upper);
                }
                while(answer4.text == answer1.text || answer4.text == answer2.text || answer4.text == answer3.text || answer4.text == -1){
                    answer4.text = randomFromInterval(0, upper);
                }
            }

            function drawProblem(){

                context.font = "50px Arial";
                context.fillStyle = 'black';
                if(problemType == 0)
                    context.fillText(question.num1 + " + " + question.num2, 445, 50);
                else if(problemType == 1)
                    context.fillText(question.num1 + " - " + question.num2, 445, 50);
            }
            function drawScore(){

                context.font = "50px Arial";
                context.fillStyle = 'white';
                context.fillText("Score: " + score, 20, 50);
            }

            function drawEndGame(){

                context.font = "60px Arial";
                context.fillStyle = 'black';
                context.fillText("GAME OVER", 300, 300);
                context.font = "30px Arial";
                context.fillText("Final Score: " + score, 15, 30);
               
                /*
                Draws from the difficulty sprite sheet the three level types to the canvas
                */
                loadRestartImages();

                canvas.addEventListener('mousemove', movemouseRestart); 
                canvas.addEventListener('mousedown', mousedownRestart); 
            }

            function loadRestartImages(){

                context.drawImage(restart,0,0,480,100,240,380,480,100);
                context.drawImage(restart,0,100,480,100,240,520,480,100);
            }
            restart.src = "../img/restart.png";

        /*
          fires whenever mouse is clicked on opening screen
        */
        function mousedownRestart(evt){

            var mousePos = getMousePos(canvas, evt);

            //checks if restartGame clicked, if it is, then remove the event listeners
            if(clickedOrHover(mousePos, restartGame)){
                this.removeEventListener('mousedown',arguments.callee,false);
                canvas.removeEventListener('mousemove',movemouseRestart);
            evt.target.style.cursor = 'default';
            startItUp();
            }
            //checks if newLevel is clicked, if it is, then remove the event listeners
            else if(clickedOrHover(mousePos, newLevel)){
                this.removeEventListener('mousedown',arguments.callee,false);
             
                canvas.removeEventListener('mousemove',movemouseRestart);
            evt.target.style.cursor = 'default';
            context.clearRect(0,0,canvas.width, canvas.height);
            begin();
            }
          
        }

        /*
          every instance of a cursor movement will cause this function to fire
        */
        function movemouseRestart(evt){

            var mousePos = getMousePos(canvas, evt);
    
            evt.target.style.cursor = 'default';
    
            //checks if restartGame is hovered
            if(clickedOrHover(mousePos, restartGame)){
            
                evt.target.style.cursor = 'pointer';
            }
            //checks if newLevel is hovered
            else if(clickedOrHover(mousePos, newLevel)){
                evt.target.style.cursor = 'pointer';
            }
            
        }


            /*
                clears the gameLoop interval
            */
            function stopGame(){
            
                clearInterval(gameLoop);
                context.clearRect(0,0,canvas.width, canvas.height);
            }

            getNewAnswerPositions();
            createProblem();

            // Create gradient
            var grd = context.createLinearGradient(0,0,960,0);
            grd.addColorStop(0,"green");
            grd.addColorStop(1,"white");


			gameLoop = setInterval(function(){

        		context.clearRect(0,0,canvas.width, canvas.height);

                // Fill with gradient
                context.fillStyle=grd;
                context.fillRect(0,0,960,63);
        

        		if(muncher.direction == "left"){
        			muncher.cxpos -= 64;

					if(muncher.xpos == 64 && muncher.ypos == 64){
        				muncher.xpos = 128;
        			}
        			else{
        				muncher.xpos = 64;
        			}
        		}
        		else if(muncher.direction == "right"){
        			muncher.cxpos += 64;

        			if(muncher.xpos == 0 && muncher.ypos == 0){
        				muncher.xpos = 128;
        			}
        			else{
        				muncher.xpos = 0;
        			}
        		}
        		else if(muncher.direction == "up"){
        			muncher.cypos -= 64;

        			if(muncher.xpos == 0 && muncher.ypos == 192){
        				muncher.xpos = 128;
        			}
        			else{
        				muncher.xpos = 0;
        			}
        		}
        		else{
        			muncher.cypos += 64;

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
        		};
                //if muncher runs into correct answer
                if(muncher.cxpos == answer1.x - 1 && muncher.cypos == answer1.y - 1){
                    createProblem();
                    getNewAnswerPositions();
                    ++score;

                    if(muncher.direction == "right"){
                        loadMuncher(64, 0, muncher.cxpos, muncher.cypos);
                    }
                    else if(muncher.direction == "left"){
                        loadMuncher(0, 64, muncher.cxpos, muncher.cypos);
                    }
                    else if(muncher.direction == "down"){
                        loadMuncher(64, 128, muncher.cxpos, muncher.cypos);
                    }
                    else{
                        loadMuncher(64, 192, muncher.cxpos, muncher.cypos);
                    }
                    drawProblem();
                    drawAnswers();
                    drawScore();
                }
                //if muncher runs into an incorrect answer or the game boundary
                else if(muncher.cxpos == answer2.x -1 && muncher.cypos == answer2.y - 1 || 
                   muncher.cxpos == answer3.x -1 && muncher.cypos == answer3.y - 1 || 
                   muncher.cxpos == answer4.x -1 && muncher.cypos == answer4.y - 1 || 
                   muncher.cxpos < 0 || muncher.cxpos >= 960 || muncher.cypos >= 768 || muncher.cypos < 64){
                    
                    stopGame();  
                    drawEndGame();
                }
                else{
                    loadMuncher(muncher.xpos, muncher.ypos, muncher.cxpos, muncher.cypos); //reload image to new position on the gameboard
                    drawProblem();
                    drawAnswers();
                    drawScore();
                }
        	}, 700);
        }     
    }