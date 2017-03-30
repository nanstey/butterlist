$(document).ready( function() {

  $('.category-header').on('click', function() {
    if ( $(this).hasClass('min') ){
      $(this).parent().find('.list-items').slideDown();
      $(this).find('.toggler i').removeClass('fa-plus').addClass('fa-minus');
      $(this).removeClass('min')
    } else {
      $(this).parent().find('.list-items').slideUp();
      $(this).find('.toggler i').removeClass('fa-minus').addClass('fa-plus');
      $(this).addClass('min');
    }
  });

  $('.list-item').on('click', function() {
    if ( $(this).hasClass('completed') ){
      $(this).removeClass('completed');
    } else {
      $(this).addClass('completed');
    }
  });

  $('.list-items').sortable({
      connectWith: ".list-items"
    }).disableSelection();

  $('.list-items').on( "sortreceive", function( event, ui ) {
    console.log($(this).parent().data('id'), ui.item.data('id'));
  } );

});