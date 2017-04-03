$(document).ready( function() {
  $('#register-submit').last().on('mouseover', function(event){
    // console.log('radio triggered');
    if ( $('#butter-no').prop('checked') === true){
      $('#butter-yes').prop('checked', true);
    }
  });
});