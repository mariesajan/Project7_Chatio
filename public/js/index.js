  $('document').ready(function(){
    var socket = io();

    $("#userSubmit").click(function(){

        if ($("#username").val()== ""){
            $("#error").html("<p>Please enter the username</p>")
        }
      else{
          socket.emit('new user',$("#username").val(),function(data){
              if(data){
                  $("#chatWrapper").show();
                  $("#namesWrapper").hide();
                  $("#chatMessage").focus();
              }

          });
      }
    });


    socket.on('error found',function(error){
        $("#error").html("<p>"+error.msg+"</p>");
    });

    $("#saySubmit").on('click',function(){
        if($("#chatMessage").val()){
            socket.emit('chat message',{
              msg: $("#chatMessage").val(),
              uname:$("#username").val()
            });

            $("#chatMessage").val('');
            $("#chatMessage").focus();
        }
    });

    $("#chatMessage").keypress(function(e){
      var key =  e.which;
      // if enter key is pressed
      if(key == 13){
        $("#saySubmit").click();
      }
    });

    socket.on('chat message',function(data){
        $("#chatMsgSent").append(data.uname+":"+data.msg+"<br>");
    });

    socket.on('username',function(data){
        var html='';

        for(var i=0;i<data.length;i++){
          html+=data[i]+"<br>";
        }
          $("#users").html(html);
    });
});
