var jsdom = require('jsdom');
var $ = require('jquery')(jsdom.jsdom().defaultView);

var cx = ['011814553479746519374:at46p1fcles','011814553479746519374:pnjydbabv94'];

function catAss(linkList, cb) {
  // console.log(uberString);
  let cat_id = 4;
  // if (uberString.includes('movie' || 'tv' || 'show' || 'film' || 'series')) {
  //   cat_id = 1;
  // } else if (uberString.includes('paper' || 'author' || 'read' || 'novel' || 'books')) {
  //   cat_id = 2;
  // } else if (uberString.includes('food' || 'eat' || 'drink' || 'restaurant' || 'cafe')) {
  //   cat_id = 3;
  // } else if (uberString.includes('music' || 'band' || 'artist' || 'song' || 'concert')) {
  //   cat_id = 5;
  // }
  // console.log('After if statement cat_id is: ', cat_id);
  cb( cat_id );
}

module.exports = {
  listQuery: function(itemQuery, cb){
    let searchString = itemQuery.toLowerCase();
    let HTMLstring = itemQuery.replace(" ", "+");
    let linkList = [];
    let url = `https://www.googleapis.com/customsearch/v1?key=AIzaSyAdslr-npcuLlN7_7-QmRV8wnVVHjgGKJ4&cx=011814553479746519374:pnjydbabv94&q=${itemQuery}`

    $.ajax({
      method: "GET",
      url: url,
    }).done( (response) => {
      let items = response.items;
      for (var item of items) {
        linkList.push(item.link);
      }
      catAss(linkList, (id) =>{
        let retObj = {'cat_id': id, 'link': linkList[0] };
        cb(retObj);
      });
    });
  },
  dummyQuery: function(itemQuery, cb){
    cb({'cat_id': 1, 'link': 'www.example.com'});
  }
}
