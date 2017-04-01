$(document).ready( function() {

  $('#inputForm').on('submit', function(event) {
      event.preventDefault();
      let input = $('#inputQuery').val();

      $.ajax({
        url: '/api/search',
        method: 'POST',
        data: {
          inputQuery: input
        }
      }).done(function (response) {
          console.log(response);
          renderListItems(response);
          console.log("I did a thing.");
      });
  });

  function renderListItems(items){
    // var $listContainer = ;
    // console.log($listContainer);
    for (let key in items){
      let $item = $('<div>').addClass('list-item').data('id', items[key].id);
      $('<a>').addClass('delete-item').append('<i>').addClass('fa fa-trash').attr('aria-hidden', 'true').appendTo($item);
      $('<p>').text(items[key].name).appendTo($item);
      $('#' + items[key].cat_id).find('.list-items').append($item);

      $($item).on('click', function() {
        if ( $(this).hasClass('completed') ){
          $(this).removeClass('completed');
        } else {
          $(this).addClass('completed');
        }
      });
    }
  }

  function createList(list){
    var $column = $('<div>').addClass('column category').attr('id',list.id).data('id', list.id);
    var $header = $('<div>').addClass('category-header').appendTo($column);

    $('<i>').addClass('fa fa-ticket').attr('aria-hidden', 'true').appendTo($header);
    $('<span>').addClass('category-name').text(list.title).appendTo($header);
    var $toggle = $('<a>').addClass('toggler').appendTo($header);
    $('<i>').addClass('fa fa-minus').attr('aria-hidden', 'true').appendTo($toggle);

    var $listDiv = $('<div>').addClass('list-items sortable').appendTo($column);

    $($listDiv).sortable({
        connectWith: ".list-items"
      }).disableSelection();

    $($listDiv).on( "sortreceive", function( event, ui ) {
      let item_id = ui.item.data('id');
      let cat_id = $(this).parent().data('id');
      // console.log(item_id, cat_id);
      // Ajax post to server
    } );

    $($header).on('click', function() {
      var $list = $(this).parent().find('.list-items');
      if ( $(this).hasClass('min') ){
        $list.slideDown();
        $listDiv.sortable('enable');
        $(this).find('.toggler i').removeClass('fa-plus').addClass('fa-minus');
        $(this).removeClass('min');
      } else {
        $list.slideUp();
        $listDiv.sortable('disable');
        $(this).find('.toggler i').removeClass('fa-minus').addClass('fa-plus');
        $(this).addClass('min');
      }
    });

    renderListItems(list.list_items);

    return $column;
  }

  function renderLists(lists){
    for (let key in lists){
      // console.log('renderLists(): ', lists)
      var column = createList(lists[key]);
      $('.columns').append(column);
      renderListItems(lists[key].list_items)
    }
  }

  function listMaker(){
    $.ajax({
      url: '/api/lists',
      type: 'GET',
      dataType: 'json',
    })
    .done(function(responseText) {
      // console.log('ListMaker() Response: ', responseText);
      renderLists(responseText);
    });
  }

  // Initialization
  listMaker();

});