const jsdom = require('jsdom');
const $ = require('jquery')(jsdom.jsdom().defaultView);

const cx = ['011814553479746519374:at46p1fcles','011814553479746519374:pnjydbabv94'];

  const triggerWords =
  [
    ['imdb','tv','movie','theatre','series','film','actor'],
    ['music','discogs','artist','allmusic'],
    ['book','indigo','chapters','novel','read'],
    ['food','yelp','tripadvisor','drink','pizza','beer'],
    ['products','amazon','walmart']
  ];

function catAss(linkList, keywords, cb) {

  console.log('were in catAss and keywords is ' + keywords);
  let cat_id = 0;
  for(var i =0; i < linkList.length;i++) {
    for (var j=0; j < keywords.length; j++) {
      for (var k=0; k< keywords[j].length; k++) {
        if (linkList[i].includes(keywords[j][k])){

          console.log('matched ' + keywords[j][k] + ' to link ' + linkList[i]);
          console.log('assigned cat_id is ' + (j + 1));
          cat_id = j + 1;

          return cb(cat_id, linkList[i]);
        }
      }
    }
  }
  // cb( cat_id );
}

module.exports = {
  listQuery: function(itemQuery, cb){
    console.log('were in listQuery');
    let searchString = itemQuery.toLowerCase();
    let HTMLstring = itemQuery.replace(" ", "+");
    let linkList = [];
    let url = `https://www.googleapis.com/customsearch/v1?key=AIzaSyAdslr-npcuLlN7_7-QmRV8wnVVHjgGKJ4&cx=011814553479746519374:at46p1fcles&q=${itemQuery}`

    $.ajax({
      method: "GET",
      url: url,
    }).done( (response) => {
      let items = response.items;
      for (var item of items) {
        console.log(item.link);
        linkList.push(item.link);
      }
      catAss(linkList, triggerWords, (id, link) =>{
        console.log('id was set to ' + id);
        let retObj = {'cat_id': id, 'link': link };
        console.log('retObj is set to ' + retObj);
        cb(retObj);
      });
    });
  },
  dummyQuery: function(itemQuery, cb){
    cb({'cat_id': 1, 'link': 'www.example.com'});
  }
}
