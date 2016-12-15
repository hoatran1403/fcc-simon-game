$('document').ready(function(){
  let waitOffset = 1000;
  let lightOffset = 500;
  let maxLevel = 20;

  var timeouts = [];
  var game = [];
  var lights = ["1","2","3","4"];
  var isPlayTime = false;
  var userStep = 0;
  var mode = "normal";

  var getMode = function(){
    return $("input[type='radio'][name='mode']:checked").val();
  }

  var lightOn = function(lightId){
    console.log(lightId);
    var audio = document.getElementById('audio' + lightId);
    audio.play();
    $("#" + lightId).addClass("light-on");
  }

  var lightOff = function(lightId){
    $("#" + lightId).removeClass("light-on")
  }

  var displayLevel = function(){
    $("#level").html(game.length);
  };

  var displayUserStep = function(){
    $("#userStep").html(userStep);
  }

  var clearGame = function(){
    game = [];
    isPlayTime = false;
    userStep = 0;

    timeouts.map(function(value){
      clearTimeout(value);
    });

    $("#warning").html('&nbsp;');
    displayUserStep();
    displayLevel();
  };

  var changeTurn = function(){
    if(isPlayTime){
      isPlayTime = false;
      $("#turn").html("Instruction Time!!!");
    }
    else{
      isPlayTime = true;
      $("#turn").html("It's your turn! Click the circle to play.");
    }

  }

  var isRightAnswer = function(ans){
    return game[userStep] === ans;
  }

  var getRandomLight = function(){
    var rand = Math.floor(Math.random() * lights.length);
    return lights[rand];
  }

  //activate light instruction
  var runInstructor = function(){
    var timer = waitOffset;
    console.log(game);

    $("#turn").html("Instruction Time!!!");

    $.each(game,function(index,value){

      timeouts.push(setTimeout(lightOn,timer,value));

      //set the lighting time for each light
      timer += lightOffset;

      var temp = setTimeout(function(){
        lightOff(value);

        if(index == game.length - 1){
          //change to user playing time
          $("#warning").html('&nbsp;');
          userStep = 0;
          displayUserStep();
          changeTurn();
        }
      },timer);

      timeouts.push(temp);

      //set waiting time
      timer += waitOffset;
    })
  }

  var goNextLevel = function(){
    // $("#turn").html("Instruction Time!!!");

    // userStep = 0;
    game.push(getRandomLight());
    displayLevel();
    runInstructor();
    displayUserStep();
  }

  var isWin = function(){
    if(userStep == maxLevel - 1) return true;
    else return false;
  }

  var addButtonEvents = function(){
    $.each(lights, function(index, value){


      $("#" + value).click(function(){
        if(isPlayTime){

          //add light-on effect on click
          lightOn(value);
          setTimeout(lightOff,100,value);

          //rule check
          if(!isRightAnswer(value)){

            $("#warning").html("Wrong! Try again");

            if(mode === "strict"){
              //restart game to level 0
              clearGame();

              //start with level 1
              goNextLevel();
            }
            else{
              // userStep = 0;
            changeTurn();
            runInstructor();
            }

          }
          else {

            $("#warning").html('&nbsp;');

            if(isWin()) {
              $("#turn").empty();
              $("#warning").html("You're Victory, Congratulation!!!");
              // displayUserStep();
            }
            else{

              userStep++;
              //check for next level
              if(userStep == game.length) {
                $("#warning").html("Great Job!");
                changeTurn();
                goNextLevel();
              }
            }

          }
          displayUserStep();
        }
      });
    });

    $('#startButton').click(function(){
      $(this).text('Restart');
      mode = getMode();
      clearGame();
      goNextLevel();
    });
  }


  var init = function(){
    clearGame();
    addButtonEvents();

  };

  init();


})
