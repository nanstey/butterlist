$(document).ready( function() {
// Input field submit on click
  $('#inputForm').on('submit', function(event) {
      event.preventDefault();
      let $input = $('#inputQuery');
      $('p.control').addClass('is-loading');
      $.ajax({
        url: '/api/search',
        method: 'POST',
        data: {
          inputQuery: $input.val()
        }
      })
      .fail( function (err){
        $('p.control').removeClass('is-loading');
        $input.addClass('is-danger');
        console.log(err);
      })
      .done( function (response) {
        $('p.control').removeClass('is-loading');
        $input.val('');
        $input.removeClass('is-danger');
        console.log(response);
        renderListItems({'0': response});
      });
  });

  function renderListItems(items){
    for (let key in items){
      let $item = $('<div>').addClass('list-item').data('id', items[key].id);
      if (items[key].completed) {
        $item.addClass('completed');
      }

      // Build DOM element
      $('<a>').addClass('delete-item').append('<i>').addClass('fa fa-trash').attr('aria-hidden', 'true').appendTo($item);
      $('<a>').addClass('link').addClass('fa fa-external-link').attr('target', '_blank').attr('href', items[key].link).appendTo($item);
      $('<p>').text(items[key].name).appendTo($item);
      $('.column[data-id="' + items[key].cat_id +'"]').find('.list-items').append($item);

      // Add/remove 'completed' status on click
      $($item).on('click', function() {
        let complete = 0;
        if ( $(this).hasClass('completed') ){
          $(this).removeClass('completed');
          complete = 0;
        } else {
          $(this).addClass('completed');
          complete = 1;
        }

        // Send to api to update database
        $.ajax({
          url: `/api/complete`,
          method: 'PUT',
          data: {
            'item_id': $(this).data('id'),
            'complete': complete
          }
        }).fail( function (err){
          console.log(err);
        }).done( function (response) {
          console.log(response);
          });
      });

      // Delete item on button click; send to api to update database
      $($item).on('click', '.delete-item', function() {
        let item_id = $item.data('id');
        $.ajax({
          url: `/api/delete/${item_id}`,
          method: 'delete'
        }).fail( function (err){
          console.log(err);
        }).done( function (response) {
          $item.fadeOut('500', function() {
            $item.remove();
          });
        });
      });

      // Prevent DOM bubbling for links
      $($item).on('click', '.link', function(event){
        event.stopPropagation();
      });
    }
  }

  // Build category list
  function createList(list){
    var $column = $('<div>').addClass('column category').attr('id',list.htmlId).attr('data-id', list.id);
    var $header = $('<div>').addClass('category-header').attr('title', list.description).appendTo($column);
    $('<i>').addClass('icon fa ' + list.icon).attr('aria-hidden', 'true').appendTo($header);
    $('<span>').addClass('category-name').text(list.title).appendTo($header);
    var $toggle = $('<a>').addClass('toggler').appendTo($header);
    $('<i>').addClass('fa fa-minus').attr('aria-hidden', 'true').appendTo($toggle);
    var $listDiv = $('<div>').addClass('list-items sortable').appendTo($column);

    // Allow sortable list items
    $($listDiv).sortable({
        connectWith: ".list-items"
      }).disableSelection();

    // Reassign category id based on sorting placement; send to api to update database
    $($listDiv).on( "sortreceive", function( event, ui ) {
      let item_id = ui.item.data('id');
      let cat_id = $(this).parent().data('id');
      $.ajax({
        url: `/api/update`,
        method: 'PUT',
        data: {
          'item_id': item_id,
          'cat_id': cat_id
        }
      }).fail( function (err){
        console.log(err);
      }).done( function (response) {
        console.log(response);
      });
    });

    // Collapse/expand toggle on list-header click event.
    $($header).on('click', $toggle, function() {
      var $list = $(this).parent().find('.list-items');
      if ( $(this).hasClass('min') ){
        $list.slideDown();
        $listDiv.sortable('enable');
        $(this).find('.toggler i').removeClass('fa-plus').addClass('fa-minus');
        $(this).removeClass('min');
      } else {
        $list.css('min-height', 0);
        $list.slideUp();
        $listDiv.sortable('disable');
        $(this).find('.toggler i').removeClass('fa-minus').addClass('fa-plus');
        $(this).addClass('min');
      }
    });

    // Render items in category list
    renderListItems(list.list_items);
      return $column;
    }

  // Create category lists; called by listMaker()
  function renderLists(lists){
    for (let key in lists){
      var column = createList(lists[key]);
      $('.columns').append(column);
      renderListItems(lists[key].list_items)
    }
  }

  // Passes renderLists users lists from database
  function listMaker(){
    $.ajax({
      url: '/api/lists',
      type: 'GET',
      dataType: 'json',
    })
    .done(function(responseText) {
      renderLists(responseText);
    });
  }

  // Initialization
  listMaker();
});