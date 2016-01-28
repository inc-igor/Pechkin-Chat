var socket = io("https://nog-val-chat.herokuapp.com");

$('textarea').keypress(function (e) {
    if (e.which == 13) {
        e.preventDefault();
        socket.emit('chat message', $('textarea').val());
        $('textarea').val('');
    }
});
socket.on('chat message', function(msg){
      $('#ext-message-container').append("<div class='message my'> <div class='time'>" + "Just now" + "</div>" + msg + "</div> <div class='avatar-icon user2'><img src='anton.jpg'></div>");
      var objDiv = document.getElementById("ext-message-container");
      objDiv.scrollTop = objDiv.scrollHeight;
});     