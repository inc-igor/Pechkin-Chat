var socket = io("http://pechkin-chat.herokuapp.com/");
//var socket = io("http://localhost:3000/");

var loginForm = $(".loginForm"),
	yourName = $("#yourName"),
	yourEmail = $("#yourEmail"),
	yourPassword = $("#yourPassword"),
	myName = $("#myName"),
	validationError = $("#validation-error"),
	loginArea = $("#loginArea"),
	chatArea = $("#chatArea"),
	messageTextArea = $('textarea'),
	messagesContainer = $('#messagesContainer');

loginForm.on('submit', function(e){
				e.preventDefault();

				name = $.trim(yourName.val());
				email = $.trim(yourEmail.val());
				pass = $.trim(yourPassword.val());
				
				if(name.length < 1){
					validationError.text("Please enter a nick name longer than 1 character!");
					return;
				}
				if(email.length < 1){
					validationError.text("Please enter a email longer than 1 character!");
					return;
				}
				if(pass.length < 1){
					validationError.text("Please enter a password longer than 1 character!");
					return;
				}			
				if(!isValid(email)) {
					validationError.text("Please enter a valid email!");
				}
				else {						
					loginArea.addClass("hide")
					chatArea.removeClass("hide");
					myName.val(name);
					socket.emit('login', {name: name, email: email, pass: pass});
				}			
			});
			
messageTextArea.keypress(function (e) {
    if (e.which == 13) {
        e.preventDefault();
		if(!$.trim(messageTextArea.val())) return;
        socket.emit('new message', { message: messageTextArea.val(), username: myName.val() });
        messageTextArea.val('');
    }
});

socket.on('new message', function(data){
	    var who = '';
	    var avaClass = '';

		if(data.username===myName.val()) {
			who = 'my';
			avaClass = 'myAva';
		}
		else {
			who = 'another';
			avaClass = 'anotherAva';
		}

      messagesContainer.append("<div class='message " + who + "'>"+ 
									"<div class='time'>Just now</div>" + data.message + 
							   "</div>"+ 
							   "<div class='" + avaClass + " avatar-icon'>"+
									"<img src='unnamed.jpg'>"+
							   "</div>");
      
	  var objDiv = document.getElementById("messagesContainer");
      objDiv.scrollTop = objDiv.scrollHeight;
});  

socket.on('logon message', function(msg){
      messagesContainer.append("<div class='message logon'>"+ 
									"<div class='time'>Just now</div>" + msg + 
							   "</div>");
      
	  var objDiv = document.getElementById("messagesContainer");
      objDiv.scrollTop = objDiv.scrollHeight;
}); 

socket.on('disconnect message', function(msg){
      messagesContainer.append("<div class='message disconnect'>"+ 
									"<div class='time'>Just now</div>" + msg + 
							   "</div>");
      
	  var objDiv = document.getElementById("messagesContainer");
      objDiv.scrollTop = objDiv.scrollHeight;
});   

function isValid(thatemail) {
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(thatemail);
	} 	
	
messageTextArea.keypress(function(e){
  if (e.which !== 13) {        
        socket.emit("typing", true);
    } else {		
		socket.emit('typing', false);
    }
});

messageTextArea.focusout(function() {
    socket.emit('typing', false);
});

socket.on("isTyping", function(data) {  
  if (data.isTyping) {
      $("#typingArea").text(data.userTyping + " печатает...");
  } else {
	  $("#typingArea").text('');
  }
});