
// Require search route
const search = require(".routes/search");

$(() => {
  $.ajax({
    method: "POST",
    url: "/"
  }).done((users) => {
    for(user of users) {
      $("<div>").text(user.name).appendTo($("body"));
    }
  });;
});
let userSearch = search.listQuery(thisValue);