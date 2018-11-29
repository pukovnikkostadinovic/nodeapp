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
    if(data.state==true){
      document.getElementById('onoff').checked=true;
    }else{
      document.getElementById('onoff').checked=false;
    }
});

$(document).ready(function(){
    var next = 1;
    $(".add-more").click(function(e){
        e.preventDefault();
        var addto = "#field" + next;
        var addRemove = "#field" + (next);
        next = next + 1;
        var newin2 = '<select class="input form-control" id="field' + next + '" name="field' + next+'>';
        for(i=0; i<10; i++){
          newin2+='<option value="'+i+'">'+i+'</option>';
        }
        newin2+='</select>';
        var newIn = '<input autocomplete="off" class="input form-control" id="field' + next + '" name="field' + next + '" type="text">';
        newIn+=newin2;
        var newInput = $(newIn);
        var removeBtn = '<button id="remove' + (next - 1) + '" class="btn btn-danger remove-me" >-</button></div><div id="field">';
        var removeButton = $(removeBtn);
        $(addto).after(newInput);
        $(addRemove).after(removeButton);
        $("#field" + next).attr('data-source',$(addto).attr('data-source'));
        $("#count").val(next);

            $('.remove-me').click(function(e){
                e.preventDefault();
                var fieldNum = this.id.charAt(this.id.length-1);
                var fieldID = "#field" + fieldNum;
                $(this).remove();
                $(fieldID).remove();
            });
    });



});
