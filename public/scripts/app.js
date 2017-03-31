$(document).ready( function() {

  function createList(list){
    console.log('createList():', list);
  }

  function renderLists(lists){
    for (let key in lists){
      // console.log('renderLists(): ', lists)
      createList(lists[key]);
    }
  }

  function listMaker(){
    $.ajax({
      url: '/api/lists',
      type: 'GET',
      dataType: 'json',
    })
    .done(function(responseText) {
      console.log('ListMaker() Response: ', responseText);
      renderLists(responseText);
    });
  }


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
    let item_id = ui.item.data('id');
    let cat_id = $(this).parent().data('id');
    // Ajax post to server
  } );

  // Initialization
  listMaker();

});