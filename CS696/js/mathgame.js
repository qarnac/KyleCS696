var canvas = document.getElementById('myCanvas'), context = canvas.getContext('2d'), difficulty = new Image(), restart = new Image();

begin();

function begin(){
    //Draws from the difficulty sprite sheet the three level types to the canvas
    difficulty.onload = function(){
            context.drawImage(difficulty,0,0,480,100,240,134,480,100);
            context.drawImage(difficulty,0,100,480,100,240,334,480,100);
            context.drawImage(difficulty,0,200,480,100,240,534,480,100);
    };
    difficulty.src = "../img/difficulty.png";
    difficulty.onload();
    //begins a countdown from 3 once a difficulty level has been clicked
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
    //clears the start interval in order to eliminate drawing the countdown to the canvas
    function stopTimer(){
        clearInterval(start);
    }
    //returns the mouse position of the cursor in the canvas
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
    var pixels = {sixthree:63,sixfour:64,sixfive:65,onetwoeight:128,oneninetwo:192,boardWidth:960,boardHeight:768};

    //return true of false if the mouse has clicked or hovered over the passed in level
    function clickedOrHover(mousePos,level){
        if(mousePos.x >= level.left && mousePos.x <= level.right && mousePos.y >= level.top && mousePos.y <= level.bottom)
            return true;
        return false;
    }
    canvas.addEventListener('mousedown', mousedown); 
    //fires whenever mouse is clicked on opening screen
    function mousedown(evt){
        var mousePos = getMousePos(canvas, evt);
        easy.clicked = false; intermediate.clicked = false; hard.clicked = false;

        //checks if easy difficulty clicked, if it is, then remove the event listener
        if(clickedOrHover(mousePos, easy)){
            this.removeEventListener('mousedown',arguments.callee,false);
            easy.clicked = true;
            clearMouseAndStart(evt);
        }
        //checks if easy difficulty clicked, if it is, then remove the event listener
        else if(clickedOrHover(mousePos, intermediate)){
            this.removeEventListener('mousedown',arguments.callee,false);
            intermediate.clicked = true;
            clearMouseAndStart(evt);
        }
        //checks if easy difficulty clicked, if it is, then remove the event listener
        else if(clickedOrHover(mousePos, hard)){
            this.removeEventListener('mousedown',arguments.callee,false);
            hard.clicked = true;
            clearMouseAndStart(evt);
        }
    }
    //removes the event listener for mousemove
    function clearMouseAndStart(evt){
        canvas.removeEventListener('mousemove',movemouse);
        evt.target.style.cursor = 'default';
        startItUp();
    }
    canvas.addEventListener('mousemove', movemouse); 
    //every instance of a cursor movement will cause this function to fire
    function movemouse(evt){
        var mousePos = getMousePos(canvas, evt);
        evt.target.style.cursor = 'default';
        //checks if easy difficulty is hovered
        if(clickedOrHover(mousePos, easy))
            evt.target.style.cursor = 'pointer';
        //checks if intermediate difficulty is hovered
        else if(clickedOrHover(mousePos, intermediate))
            evt.target.style.cursor = 'pointer';
        //checks if hard difficulty is hovered
        else if(clickedOrHover(mousePos, hard))
            evt.target.style.cursor = 'pointer';
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
    //begin the math game
    function runGame(){
        var muncher = {image:new Image(),xpos:0,ypos:0,cxpos:448,cypos:320,prevx:0,prevy:0,direction:"right",framesize:pixels.sixfour};
        var enemy = {image:new Image(),xpos:0,ypos:0,cxpos:0,cypos:704,prevx:0,prevy:0,direction:"right",prevDirection:"right",framesize:pixels.sixfour};
        var gameboard = {framesize:pixels.sixfour};

        context.clearRect(0,0,canvas.width, canvas.height);

        function loadMuncher(xpos, ypos, cxpos, cypos){
            context.drawImage(muncher.image,xpos,ypos,muncher.framesize,muncher.framesize,muncher.cxpos,muncher.cypos,gameboard.framesize,gameboard.framesize);
        }
        muncher.image.src = "../img/spritesheet.png";

        function loadEnemy(xpos, ypos, cxpos, cypos){
            context.drawImage(enemy.image,xpos,ypos,enemy.framesize,enemy.framesize,enemy.cxpos,enemy.cypos,gameboard.framesize,gameboard.framesize);
        }
        enemy.image.src = "../img/enemy.png";

        //answer positions on gameboard
        var answer1 = {x:0, y:0, bx:0, by:0, text:-1};
        var answer2 = {x:0, y:0, bx:0, by:0, text:-1};
        var answer3 = {x:0, y:0, bx:0, by:0, text:-1};
        var answer4 = {x:0, y:0, bx:0, by:0, text:-1};
        //provides a random position on the gameboard
        function randomPos(answer){
            var num = randomFromInterval(0, 2);
            if(num == 1)
                answer.x = randomFromInterval(2, 3);
            else if(num == 2)
                answer.x = randomFromInterval(11, 12);
            else
                answer.x = randomFromInterval(6, 7);
            num = randomFromInterval(0, 2);
            if(num == 1)
                answer.y = randomFromInterval(2, 3);
            else if(num == 2)
                answer.y = randomFromInterval(5, 6);
            else
                answer.y = randomFromInterval(9, 10);
        }
        //position each answer on the gameboard in terms of its pixel location
        function convertMovesToPixels(answer){
            answer.x = (pixels.sixfour * answer.x) + 1;
            answer.y = (pixels.sixfour * answer.y) + 1;
            answer.bx = answer.x + 62;
            answer.by = answer.y + 62;
        }
        //calculate new positions for each answer
        function getNewAnswerPositions(){
            randomPos(answer1);
            randomPos(answer2);
            randomPos(answer3);
            randomPos(answer4);

            convertMovesToPixels(answer1);
            convertMovesToPixels(answer2);
            convertMovesToPixels(answer3);
            convertMovesToPixels(answer4);
            //finds a new position for answer 1 if it is adjacent to muncher 
            while( adjacencyMuncherAnswer1() ){
                randomPos(answer1);
                convertMovesToPixels(answer1);
            }
            //finds a new position for answer 2 if it is adjacent to answer 1 or muncher 
            while( adjacencyMuncherAnswer12() ){
               randomPos(answer2);
               convertMovesToPixels(answer2);
            }
            //finds a new position for answer 3 if it is adjacent to answer 1 or 2 or muncher
            while( adjacencyMuncherAnswer123() ){
                randomPos(answer3);
                convertMovesToPixels(answer3);
            }
            //finds a new position for answer 4 if it is adjacent to answer 1 or 2 or 3 or muncher
            while( adjacencyMuncherAnswer1234() ){
                randomPos(answer4);
                convertMovesToPixels(answer4);
            }
        }

        function adjacencyMuncherAnswer1(){
            return (muncher.cxpos == answer1.x + pixels.sixthree || muncher.cxpos == answer1.x - pixels.sixfive || muncher.cxpos == answer1.x - 1) && (muncher.cypos == answer1.y + pixels.sixthree || muncher.cypos == answer1.y - pixels.sixfive || muncher.cypos == answer1.y - 1);
        }
        function adjacencyMuncherAnswer12(){
            return (answer1.x == answer2.x || answer1.x == answer2.x + pixels.sixfour || answer1.x == answer2.x - pixels.sixfour) && (answer1.y == answer2.y || answer1.y == answer2.y + pixels.sixfour || answer1.y == answer2.y - pixels.sixfour) || 
                   (muncher.cxpos == answer2.x + pixels.sixthree || muncher.cxpos == answer2.x - pixels.sixfive || muncher.cxpos == answer2.x - 1) && (muncher.cypos == answer2.y + pixels.sixthree || muncher.cypos == answer2.y - pixels.sixfive || muncher.cypos == answer2.y - 1);
        }
        function adjacencyMuncherAnswer123(){
            return (answer1.x == answer3.x || answer1.x == answer3.x + pixels.sixfour || answer1.x == answer3.x - pixels.sixfour) && (answer1.y == answer3.y || answer1.y == answer3.y + pixels.sixfour || answer1.y == answer3.y - pixels.sixfour) ||
                   (answer2.x == answer3.x || answer2.x == answer3.x + pixels.sixfour || answer2.x == answer3.x - pixels.sixfour) && (answer2.y == answer3.y || answer2.y == answer3.y + pixels.sixfour || answer2.y == answer3.y - pixels.sixfour) || 
                   (muncher.cxpos == answer3.x + pixels.sixthree || muncher.cxpos == answer3.x - pixels.sixfive || muncher.cxpos == answer3.x - 1) && (muncher.cypos == answer3.y + pixels.sixthree || muncher.cypos == answer3.y - pixels.sixfive || muncher.cypos == answer3.y - 1);
        }
        function adjacencyMuncherAnswer1234(){
            return (answer1.x == answer4.x || answer1.x == answer4.x + pixels.sixfour || answer1.x == answer4.x - pixels.sixfour) && (answer1.y == answer4.y || answer1.y == answer4.y + pixels.sixfour || answer1.y == answer4.y - pixels.sixfour) ||
                   (answer2.x == answer4.x || answer2.x == answer4.x + pixels.sixfour || answer2.x == answer4.x - pixels.sixfour) && (answer2.y == answer4.y || answer2.y == answer4.y + pixels.sixfour || answer2.y == answer4.y - pixels.sixfour) ||
                   (answer3.x == answer4.x || answer3.x == answer4.x + pixels.sixfour || answer3.x == answer4.x - pixels.sixfour) && (answer3.y == answer4.y || answer3.y == answer4.y + pixels.sixfour || answer3.y == answer4.y - pixels.sixfour) || 
                   (muncher.cxpos == answer4.x + pixels.sixthree || muncher.cxpos == answer4.x - pixels.sixfive || muncher.cxpos == answer4.x - 1) && (muncher.cypos == answer4.y + pixels.sixthree || muncher.cypos == answer4.y - pixels.sixfive || muncher.cypos == answer4.y - 1);
        }


        var twoAnswers = document.getElementById('twoAnswers');
        var threeAnswers = document.getElementById('threeAnswers');
        var fourAnswers = document.getElementById('fourAnswers');
        var a2 = false; //determines if only 2 available answers are selected by user
        var a3 = false; //determines if only 3 available answers are selected by user
        //draw each of the answers on the gameboard
        function drawAnswers(){
            if(a2 == true){
                context.roundRect(answer1, 5);
                context.roundRect(answer2, 5);
              
                positionNum(answer1);
                positionNum(answer2);
                answer3.x = -100; answer3.y = -100;
                answer4.x = -100; answer4.y = -100; 
            }
            else if(a3 == true){
                context.roundRect(answer1, 5);
                context.roundRect(answer2, 5);
                context.roundRect(answer3, 5);
                
                positionNum(answer1);
                positionNum(answer2);
                positionNum(answer3);
                answer4.x = -100; answer4.y = -100;
            }
            else{
                context.roundRect(answer1, 5);
                context.roundRect(answer2, 5);
                context.roundRect(answer3, 5);
                context.roundRect(answer4, 5);
           
                positionNum(answer1);
                positionNum(answer2);
                positionNum(answer3);
                positionNum(answer4);
            }
        }
        //draw the answer text in the center of each possible answer
        function positionNum(answer){
            if(answer.text > 99)
                context.fillText(answer.text, answer.x + 8, answer.y + 41);
            else if(answer.text > 9)
                context.fillText(answer.text, answer.x + 15, answer.y + 41);
            else
                context.fillText(answer.text, answer.x + 23, answer.y + 41);
        }
        //return a random integer from an integer to another integer
        function randomFromInterval(from,to){
            return Math.floor(Math.random()*(to-from+1)+from);
        }

        var question = {num1:0, num2:0}; 
        var score = 0, problemType;
        //2d array for primes - easy - intermediate - hard
        var primes = [[2,3,5,7,11,13,17,19,23] , [29,31,37,41,43,47,53,59,61] , [67,71,73,79,83,89,97,101,103]];
        //check for primes
        var checker = true;

        //randomly selects the problem type (add,sub,mult,div,primes) and creates the problem based on the difficulty selected
        function createProblem(){
            problemType = randomFromInterval(0, 4);
            switch(problemType){
                //addition
                case 0: 
                    if(easy.clicked == true){
                        question.num1 = randomFromInterval(0, 6);
                        question.num2 = randomFromInterval(0, 6);
                    }
                    else if(intermediate.clicked == true){
                        question.num1 = randomFromInterval(7, 20);
                        question.num2 = randomFromInterval(0, 20);
                    }
                    else{
                        question.num1 = randomFromInterval(21, 30);
                        question.num2 = randomFromInterval(0, 30);
                    }
                    answer1.text = question.num1 + question.num2;
                    getIncorrectAnswers(answer1.text);
                    break;
                //subtraction
                case 1:
                     if(easy.clicked == true){
                        question.num1 = randomFromInterval(0, 8);
                        question.num2 = randomFromInterval(0, 8);

                        while(question.num2 >= question.num1)
                            question.num2 = randomFromInterval(0, 8);
                    }
                    else if(intermediate.clicked == true){
                        question.num1 = randomFromInterval(15, 20);
                        question.num2 = randomFromInterval(0, 14);
                    }
                    else{
                        question.num1 = randomFromInterval(21, 35);
                        question.num2 = randomFromInterval(0, 20);
                    }
                    answer1.text = question.num1 - question.num2;
                    getIncorrectAnswers(answer1.text);
                    break;
                //multiplication
                case 2:
                    if(easy.clicked == true){
                        question.num1 = randomFromInterval(0, 5);
                        question.num2 = randomFromInterval(0, 5);
                    }
                    else if(intermediate.clicked == true){
                        question.num1 = randomFromInterval(6, 9);
                        question.num2 = randomFromInterval(4, 9);
                    }
                    else{
                        question.num1 = randomFromInterval(9, 12);
                        question.num2 = randomFromInterval(5, 12);
                    }
                    answer1.text = question.num1 * question.num2;
                    getIncorrectAnswers(answer1.text);
                    break;
                //division
                case 3:
                    if(easy.clicked == true){
                        question.num1 = randomFromInterval(0, 25);
                        question.num2 = randomFromInterval(1, 25);
                        while(question.num1 % question.num2 != 0)
                            question.num2 = randomFromInterval(1, 25);
                    }
                    else if(intermediate.clicked == true){
                        question.num1 = randomFromInterval(10, 48);
                        question.num2 = randomFromInterval(2, 24);
                        while(question.num1 % question.num2 != 0 || question.num1 / question.num2 == 1){
                            question.num1 = randomFromInterval(10, 48);
                            question.num2 = randomFromInterval(2, 24);
                        }
                    }
                    else{
                        question.num1 = randomFromInterval(20, 100);
                        question.num2 = randomFromInterval(2, 50);
                        while(question.num1 % question.num2 != 0 || question.num1 / question.num2 == 1){
                            question.num1 = randomFromInterval(20, 100);
                            question.num2 = randomFromInterval(2, 50);
                        }
                    }
                    answer1.text = question.num1 / question.num2;
                    getIncorrectAnswers(answer1.text);
                    break;
                //prime numbers
                case 4:
                    var index = randomFromInterval(0, 8);
                    if(easy.clicked == true)
                        answer1.text = primes[0][index];
                    else if(intermediate.clicked == true)
                        answer1.text = primes[1][index];
                    else
                        answer1.text = primes[2][index];
                    getPrimeAnswers(answer1.text);
                    break;       
           }   
        }
        var count = {total:0};
        var checker;
        //checks if the answerObject is in the list of primes
        function checkPrimes(answerObject, answer){
            var difference = 7;
            if(answer < 7)
                difference = answer;
            answerObject.text = randomFromInterval(answer - difference, answer + 7);
            for(var i = 0; i < primes.length; ++i){
                for(var j = 0; j < primes[i].length; ++j){
                    if(primes[i][j] == answerObject.text)
                        ++count.total;
                }
            }
            if(count.total == 0)
                checker = false;
            count.total = 0;    
        }
        //creates the prime answer choices available to the user
        function getPrimeAnswers(answer){
            checker = true;
            //easy or intermediate difficulty chosen, primes answer choices can be divisible by 2
            if(hard.clicked == false){
                while(checker || answer2.text == answer)
                    checkPrimes(answer2, answer);
                checker = true;
                while(checker || answer3.text == answer || answer2.text == answer3.text)
                    checkPrimes(answer3, answer);
                checker = true;
                while(checker || answer4.text == answer || answer2.text == answer4.text || answer3.text == answer4.text)
                    checkPrimes(answer4, answer);
            }
            //hard difficulty chosen, have no prime number choices divisible by 2
            else{
                checker = true;
                while(checker || answer2.text == answer || answer2.text % 2 == 0)
                    checkPrimes(answer2, answer);
                checker = true;
                while(checker || answer3.text == answer || answer2.text == answer3.text || answer3.text % 2 == 0)
                    checkPrimes(answer3, answer);
                checker = true;
                while(checker || answer4.text == answer || answer2.text == answer4.text || answer3.text == answer4.text || answer4.text % 2 == 0)
                    checkPrimes(answer4, answer);
            }
        }
        //initializes incorrect answer choices for the user
        function getIncorrectAnswers(answer){
            var difference = 7;
            if(answer < 7)
                difference = answer;

            answer2.text = randomFromInterval(answer - difference, answer + 7);
            answer3.text = randomFromInterval(answer - difference, answer + 7);
            answer4.text = randomFromInterval(answer - difference, answer + 7);

            while(answer2.text == answer1.text)
                answer2.text = randomFromInterval(answer - difference, answer + 7);
            while(answer3.text == answer1.text || answer3.text == answer2.text)
                answer3.text = randomFromInterval(answer - difference, answer + 7);
            while(answer4.text == answer1.text || answer4.text == answer2.text || answer4.text == answer3.text)
                answer4.text = randomFromInterval(answer - difference, answer + 7);
        }
        //draw the problem at the top of the screen
        function drawProblem(){
            context.font = "50px Arial";
            context.fillStyle = 'black';
            if(problemType == 0)
                context.fillText(question.num1 + " + " + question.num2, 445, 50);
            else if(problemType == 1)
                context.fillText(question.num1 + " - " + question.num2, 445, 50);
            else if(problemType == 2)
                context.fillText(question.num1 + " x " + question.num2, 445, 50);
            else if(problemType == 3)
                context.fillText(question.num1 + " ÷ " + question.num2, 445, 50);
            else{
                context.fillText("Prime Numbers", 340, 50);
            }
        }
        //draw a warning meaning the enemy is currently chasing you
        function drawEnemyWarning(){
            context.beginPath();
            context.arc(900, 30, 20, 0, 2 * Math.PI, false);
            context.fillStyle = 'red';
            context.fill();
            context.lineWidth = 2;
            context.strokeStyle = '#003300';
            context.stroke();
        }
        //draw current score it top left corner
        function drawScore(){
            context.font = "50px Arial";
            context.fillStyle = 'white';
            context.fillText("Score: " + score, 20, 50);
        }
        //once the game has ended draw the results
        function drawEndGame(){
            context.font = "60px Arial";
            context.fillStyle = 'black';
            context.fillText("GAME OVER", 300, 300);
            context.font = "30px Arial";
            context.fillText("Final Score: " + score, 15, 30);
           
            //draws from the difficulty sprite sheet the three level types to the canvas
            loadRestartImages();
            canvas.addEventListener('mousemove', movemouseRestart); 
            canvas.addEventListener('mousedown', mousedownRestart); 
        }
        //draw both the restart button and the new level button in the center of the screen
        function loadRestartImages(){
            context.drawImage(restart,0,0,480,100,240,380,480,100);
            context.drawImage(restart,0,100,480,100,240,520,480,100);
        }
        restart.src = "../img/restart.png";
        //fires whenever mouse is clicked on opening screen
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
        //every instance of a cursor movement will cause this function to fire
        function movemouseRestart(evt){
            var mousePos = getMousePos(canvas, evt);

            evt.target.style.cursor = 'default';

            //checks if restartGame is hovered
            if(clickedOrHover(mousePos, restartGame))
                evt.target.style.cursor = 'pointer';
            //checks if newLevel is hovered
            else if(clickedOrHover(mousePos, newLevel))
                evt.target.style.cursor = 'pointer'; 
        }

        var timer;
        //clears the gameLoop interval
        function stopGame(){
            clearTimeout(timer);
            context.clearRect(0,0,canvas.width, canvas.height);
        }
        getNewAnswerPositions();
        createProblem();

        var fps;
        var slow = document.getElementById('gameSpeed1');
        var normal = document.getElementById('gameSpeed2');
        var fast = document.getElementById('gameSpeed3');

        // Create gradient
        var grd = context.createLinearGradient(0,0,pixels.boardWidth,0);
        grd.addColorStop(0,"green");
        grd.addColorStop(1,"white");

        if(twoAnswers.checked == true){
            a2 = true;
            a3 = false;
        }
        else if(threeAnswers.checked == true){
            a2 = false;
            a3 = true;
        }
        else if(fourAnswers.checked == true){
            a2 = false;
            a3 = false;
        }

        gameLoop(); //run the gameloop

        var randomDirection;
        var played = 0;
        var c = 4;
        var eaten = false;
        var chase = 10;
        var chaseOn = false;
        //during gameplay, this function is ran every second
		function gameLoop(){
            if(yesEnemy.checked == true  && played == 0){
                document.getElementById('bloop').play();
                played = 1;
            }
            if(noEnemy.checked == true){
                played = 0;
                chaseOn = false;
            }
            
            if(slow.checked == true)
                fps = 800;
            else if(normal.checked == true)
                fps = 600;
            else if(fast.checked == true)
                fps = 400;
            
            timer = setTimeout(gameLoop, fps);

    		context.clearRect(0,0,canvas.width, canvas.height);

            // Fill with gradient
            context.fillStyle=grd;
            context.fillRect(0,0,pixels.boardWidth,pixels.sixthree);

            muncher.prevx = muncher.cxpos;
            muncher.prevy = muncher.cypos;
            enemy.prevx = enemy.cxpos;
            enemy.prevy = enemy.cypos;
    
    		if(muncher.direction == "left"){
    			muncher.cxpos -= pixels.sixfour;
				if(muncher.xpos == pixels.sixfour && muncher.ypos == pixels.sixfour)
    				muncher.xpos = pixels.onetwoeight;
    			else
    				muncher.xpos = pixels.sixfour;
    		}
    		else if(muncher.direction == "right"){
    			muncher.cxpos += pixels.sixfour;
    			if(muncher.xpos == 0 && muncher.ypos == 0)
    				muncher.xpos = pixels.onetwoeight;
    			else
    				muncher.xpos = 0;
    		}
    		else if(muncher.direction == "up"){
    			muncher.cypos -= pixels.sixfour;
    			if(muncher.xpos == 0 && muncher.ypos == pixels.oneninetwo)
    				muncher.xpos = pixels.onetwoeight;
    			else
    				muncher.xpos = 0;
    		}
    		else{
    			muncher.cypos += pixels.sixfour;
    			if(muncher.xpos == 0 && muncher.ypos == pixels.onetwoeight)
    				muncher.xpos = pixels.onetwoeight;
    			else
    				muncher.xpos = 0;
    		}
            //determines enemy direction, which is a loop around the gameboard until muncher is in proximity then it chases
            function currentDirection(dir){
                if(dir == "left"){
                    enemy.direction = "left";
                    if(enemy.prevDirection == enemy.direction){
                        if(enemy.xpos == 0){
                            enemy.xpos = pixels.sixfour;
                            enemy.ypos = pixels.sixfour;
                        }
                        else{
                            enemy.xpos = 0;
                            enemy.ypos = pixels.sixfour;
                        }
                    }
                    else{
                        enemy.xpos = 0;
                        enemy.ypos = pixels.sixfour;
                    }
                }
                else if(dir == "right"){
                    enemy.direction = "right";
                    if(enemy.prevDirection == enemy.direction){
                        if(enemy.xpos == 0){
                            enemy.xpos = pixels.sixfour;
                            enemy.ypos = 0;
                        }
                        else{
                            enemy.xpos = 0;
                            enemy.ypos = 0;
                        }
                    }
                    else{
                        enemy.xpos = 0;
                        enemy.ypos = 0;
                    }
                }
                else if(dir == "up"){
                    enemy.direction = "up";
                    if(enemy.prevDirection == enemy.direction){
                        if(enemy.xpos == 0){
                            enemy.xpos = pixels.sixfour;
                            enemy.ypos = pixels.onetwoeight;
                        }
                        else{
                            enemy.xpos = 0;
                            enemy.ypos = pixels.onetwoeight;
                        }
                    }
                    else{
                        enemy.xpos = 0;
                        enemy.ypos = pixels.onetwoeight;
                    }
                }
                else{
                    enemy.direction = "down";
                    if(enemy.prevDirection == enemy.direction){
                        if(enemy.xpos == 0){
                            enemy.xpos = pixels.sixfour;
                            enemy.ypos = pixels.oneninetwo;
                        }
                        else{
                            enemy.xpos = 0;
                            enemy.ypos = pixels.oneninetwo;
                        }
                    }
                    else{
                        enemy.xpos = 0;
                        enemy.ypos = pixels.oneninetwo;
                    }
                }
            }
            //determines if enemy is checked by user
            if(noEnemy.checked == true){
                enemy.cxpos = -100;
                enemy.cypos = -100;
            }
            else{
                if(enemy.cxpos == -100){
                    enemy.cxpos = 0;
                    enemy.cypos = 704;
                }
                enemy.prevDirection = enemy.direction;

                if(chase == 0)
                    chaseOn = false;
                //if the enemy is close to the muncher, have it chase the muncher for 10 seconds
                if(Math.abs(enemy.cxpos - muncher.cxpos) <= 256 && Math.abs(enemy.cypos - muncher.cypos) <= 256 && chase == 10)
                    chaseOn = true;
                if(chaseOn == true){
                    if(muncher.cypos < enemy.cypos){
                        enemy.cypos -= pixels.sixfour;
                        currentDirection("up");
                    }
                    else if(muncher.cypos > enemy.cypos){
                        enemy.cypos += pixels.sixfour;
                        currentDirection("down");
                    }
                    else if(muncher.cxpos > enemy.cxpos){
                        enemy.cxpos += pixels.sixfour;
                        currentDirection("right");
                    }
                    else if(muncher.cxpos < enemy.cxpos){
                        enemy.cxpos -= pixels.sixfour;
                        currentDirection("left");
                    }
                    --chase;
                    if(chase == 0)
                        chaseOn = false;
                }
                else{
                    if(chase < 10)
                        ++chase;
                    if(enemy.direction == "right" && enemy.cxpos == 896 && enemy.cypos == pixels.sixfour){
                        enemy.direction = "down";
                        enemy.cypos += pixels.sixfour;
                        currentDirection("down");
                    }
                    else if(enemy.direction == "right" && enemy.cxpos < 896){
                        enemy.cxpos += pixels.sixfour;
                        currentDirection("right");
                    }
                    else if(enemy.direction == "right" && enemy.cxpos == 896){
                        enemy.direction = "up";
                        enemy.cypos -= pixels.sixfour;
                        currentDirection("up");
                    }
                    else if(enemy.direction == "up" && enemy.cxpos == 0 && enemy.cypos == pixels.sixfour){
                        enemy.direction = "right";
                        enemy.cxpos += pixels.sixfour;
                        currentDirection("right");
                    }
                    else if(enemy.direction == "up" && enemy.cypos > pixels.sixfour){
                        enemy.cypos -= pixels.sixfour;
                        currentDirection("up");
                    }
                    else if(enemy.direction == "up" && enemy.cypos == pixels.sixfour){
                        enemy.direction = "left";
                        enemy.cxpos -= pixels.sixfour;
                        currentDirection("left");
                    }
                    else if(enemy.direction == "left" && enemy.cxpos == 0 && enemy.cypos == 704){
                        enemy.direction = "up";
                        enemy.cypos -= pixels.sixfour;
                        currentDirection("up");
                    }
                    else if(enemy.direction == "left" && enemy.cxpos > 0){
                        enemy.cxpos -= pixels.sixfour;
                        currentDirection("left");
                    }
                    else if(enemy.direction == "left" && enemy.cxpos == 0){
                        enemy.direction = "down";
                        enemy.cypos += pixels.sixfour;
                        currentDirection("down");
                    }
                    else if(enemy.direction == "down" && enemy.cxpos == 896 && enemy.cypos == 704){
                        enemy.direction = "left";
                        enemy.cxpos -= pixels.sixfour;
                        currentDirection("left");
                    }
                    else if(enemy.direction == "down" && enemy.cypos < 704){
                        enemy.cypos += pixels.sixfour;
                        currentDirection("down");
                    }
                    else if(enemy.direction == "down" && enemy.cypos == 704){
                        enemy.direction = "right";
                        enemy.cxpos += pixels.sixfour;
                        currentDirection("right");
                    }
                }
            } 
    		document.onkeydown = function(evt){

    			evt = evt || window.event;
    			switch(evt.keyCode){
    				case 37:
    				    evt.preventDefault(); //prevents user from scrolling during gameplay
    				    if(muncher.direction != "left"){
    				    	muncher.xpos = pixels.sixfour;
    				    	muncher.ypos = pixels.sixfour;
    				    }
    					muncher.direction = "left";
    					break;
    				case 38:
                        evt.preventDefault();
    					if(muncher.direction != "up"){
    				    	muncher.xpos = 0;
    				    	muncher.ypos = pixels.oneninetwo;
    				    }
    					muncher.direction = "up";
    					break;
    				case 39:
                        evt.preventDefault();
    					if(muncher.direction != "right"){
    				    	muncher.xpos = 0;
    				    	muncher.ypos = 0;
    				    }			
    					muncher.direction = "right";
    					break;
    				case 40:
                        evt.preventDefault();
    					if(muncher.direction != "down"){
    				    	muncher.xpos = 0;
    				    	muncher.ypos = pixels.onetwoeight;
    				    }    				
    					muncher.direction = "down";
    					break;
    			}
    		};
            if(eaten == true){
                if(c == 0){
                    stopGame();  
                    drawEndGame();
                }
                else{
                    loadEnemy(enemy.xpos, enemy.ypos, enemy.cxpos, enemy.cypos);
                    drawProblem();
                    drawAnswers();
                    drawScore();
                    --c;
                }
            }
            //if muncher runs into correct answer
            else if(muncher.cxpos == answer1.x - 1 && muncher.cypos == answer1.y - 1){
                createProblem();
                getNewAnswerPositions();
                ++score;

                if(muncher.direction == "right")
                    loadMuncher(pixels.sixfour, 0, muncher.cxpos, muncher.cypos);
                else if(muncher.direction == "left")
                    loadMuncher(0, pixels.sixfour, muncher.cxpos, muncher.cypos);
                else if(muncher.direction == "down")
                    loadMuncher(pixels.sixfour, pixels.onetwoeight, muncher.cxpos, muncher.cypos);
                else
                    loadMuncher(pixels.sixfour, pixels.oneninetwo, muncher.cxpos, muncher.cypos);
                
                if(twoAnswers.checked == true){
                    a2 = true;
                    a3 = false;
                }
                if(threeAnswers.checked == true){
                    a2 = false;
                    a3 = true;
                }
                if(fourAnswers.checked == true){
                    a2 = false;
                    a3 = false;
                }
                drawProblem();
                drawAnswers();
                drawScore();
                loadEnemy(enemy.xpos, enemy.ypos, enemy.cxpos, enemy.cypos);
                if(chaseOn == true)
                    drawEnemyWarning();
                document.getElementById('chomp').play();
            }
            //if muncher runs into an incorrect answer or the game boundary
            else if(muncher.cxpos == answer2.x -1 && muncher.cypos == answer2.y - 1 || 
               muncher.cxpos == answer3.x -1 && muncher.cypos == answer3.y - 1 || 
               muncher.cxpos == answer4.x -1 && muncher.cypos == answer4.y - 1 || 
               muncher.cxpos < 0 || muncher.cxpos >= pixels.boardWidth || muncher.cypos >= 768 || muncher.cypos < pixels.sixfour){
            
                if(score <= 4)
                    document.getElementById('bad').play();
                else if(score > 4 && score < 8)
                    document.getElementById('good').play();
                else
                    document.getElementById('excellent').play();
                stopGame();  
                drawEndGame();
            }
            //check if enemy eats muncher
            else if(muncher.cxpos == enemy.cxpos && muncher.cypos == enemy.cypos || enemy.prevx == muncher.cxpos && enemy.prevy == muncher.cypos && muncher.prevx == enemy.cxpos && muncher.prevy == enemy.cypos){
                document.getElementById('enemychomp').play();
                eaten = true;
                chaseOn = false;
                muncher.cxpos = -100;
                muncher.cypos = -100;
                loadEnemy(enemy.xpos, enemy.ypos, enemy.cxpos, enemy.cypos);
                drawProblem();
                drawAnswers();
                drawScore();
            }
            else{
                loadMuncher(muncher.xpos, muncher.ypos, muncher.cxpos, muncher.cypos); //reload image to new position on the gameboard
                loadEnemy(enemy.xpos, enemy.ypos, enemy.cxpos, enemy.cypos);
                drawProblem();
                drawAnswers();
                drawScore();
                if(chaseOn == true)
                    drawEnemyWarning();
            }
    	}
    }     
}