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

              }
          });
      }
    });


    socket.on('error found',function(error){
        $("#error").html("<p>"+error.msg+"</p>");
    });

    $("#saySubmit").click(function(){
        if($("#chatMessage").val()){
            socket.emit('chat message',{
              msg: $("#chatMessage").val(),
              uname:$("#username").val()
            });

            $("#chatMessage").val('');
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
