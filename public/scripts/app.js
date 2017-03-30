

$("#list-input").submit((event) => {
  $.ajax({
    url: "/search",
    type: "POST",
    data: $("#list-input").serialize()
    success: (data) => {
      return data;
    }
  })
  event.preventDefault();
});


$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done((users) => {
    for(user of users) {
      $("<div>").text(user.name).appendTo($("body"));
    }
  });;
});
