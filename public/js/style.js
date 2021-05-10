window.onload = function(){
    //hide the preloader
    document.querySelector(".spinner-wrapper").style.display = "none";
}
$(document).ready(function(){
    $('.tooltipped').tooltip();
  });



// let link = document.getElementById('#myInput');

// document.querySelector('#shareIt').addEventListener('click', shareFunction);

function share(id){
    let postId = id
    var text = `http://localhost:3000/publicStories/${postId}`;
    // console.log(link);
    navigator.clipboard.writeText(text).then(function() {
        alert('Async: Copying to clipboard was successful!');
    }, function(err) {
        alert('Async: Could not copy text: ', err);
    });
}



  $(document).ready(function() {
    $('input#input_text, textarea#textarea2').characterCounter();
  });

  

    