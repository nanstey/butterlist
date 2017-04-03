$(document).ready( function() {
  // Automatically check 'Yes' to 'Do you like butter?' regardless of input
  $('#register-submit').last().on('mouseover', function(event){
    // console.log('radio triggered');
    if ( $('#butter-no').prop('checked') === true){
      $('#butter-yes').prop('checked', true);
    }
  });
});