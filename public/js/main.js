var socket = io.connect('http://localhost:3000');
//var socket = io.connect('http://yeti.cf:80');
var state1;
var output = document.getElementById('output');
function toggle(button)
{
  if(button.value=='OFF'){
   button.value='ON';
   state1=true;
  }
  else{
   button.value='OFF';
   state1=false;
  }

   socket.emit('chat', {
     //message: message.value,
     //handle: handle.value,
     state: state1
   });
   console.log(button.value);
}

$(document).ready(function(){
  $('.delete-article').on('click', function(e){
    $target = $(e.target);
    const id = $target.attr('data-id');
    $.ajax({
      type: 'DELETE',
      url: '/articles/'+id,
      success: function(response){
        //alert('Deleting Article');
        window.location.href='/';
      },
      error: function(err){
        console.log(err);
      }
    });
  });
});

socket.on('chat', function(data){
  //output.innerHTML += '<p><strong>' + data.handle + ':</strong>'+data.message+'</p>';
    output.innerHTML = '<p><strong>' + data.state + '</strong></p>';
    output.innerHTML += '<p><strong>' + data.handle + '</strong></p>';
});
