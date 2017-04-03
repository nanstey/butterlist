const jsdom = require('jsdom');
const $ = require('jquery')(jsdom.jsdom().defaultView);
// Google API keys and Custom search engine keys to be cycled
const apiKeys =
  [
    {'cx': '002722805530366229806:-t-5uikfp5u', 'key': 'AIzaSyCWqmdprHP_z1yZSqJQsld_n5cXULAhEPw' },
    {'cx': '011814553479746519374:at46p1fcles', 'key': 'AIzaSyAdslr-npcuLlN7_7-QmRV8wnVVHjgGKJ4' },
    {'cx': '007555445453685937442:zjbtlh-ohdo', 'key': 'AIzaSyCWHfE06eMEutn-3LnhU_QUI1isU2B3src' }
  ];
let keyPos = 0;

// Cycles through keys so we get 100*3=300 queries per day :)
function getKeys() {
  let keys = apiKeys[keyPos];
  keyPos = (keyPos + 1) % apiKeys.length;
  return keys;
}

// Keywords to search against, assign category
const triggerWords =
  [
    ['imdb','tv','movie','theatre','series','film','actor'],
    ['music','discogs','artist','allmusic'],
    ['book','indigo','chapters','novel','read'],
    ['food','yelp','tripadvisor','drink','pizza','beer'],
    ['products','amazon','walmart']
  ];

// Function to assign category id based on keyword match; Called by listQuery()
function catAss(linkList, keywords, catAssign, cb) {
  let countArray = [[],[],[],[],[]];
  let cat_id = 0;
  for(var i =0; i < linkList.length;i++) {
    for (var j=0; j < keywords.length; j++) {
      for (var k=0; k< keywords[j].length; k++) {
        if (linkList[i].includes(keywords[j][k])){
          countArray[j].push(linkList[i]);
        }
      }
    }
  }
  let link = '';
  // Pull relevant link for re-assigned categories
  if (catAssign){
    link = countArray[catAssign-1][0];
    return cb(catAssign, link);
  }
  let max = 0;
  let maxPos = 0;
  for (var i = 0; i < countArray.length; i++){
    if (countArray[i].length > max) {
      max = countArray[i].length;
      maxPos = i;
    }
  }
  cat_id = maxPos +1;
  link = countArray[maxPos][0];
  return cb(cat_id, link);
}

// Function to return category id and top link; Required in api.js
module.exports = {
  listQuery: function(itemQuery, catAssign, cb){
    let linkList = [];
    let HTMLstring = itemQuery.replace(/\s/g, "+");
    let keys = getKeys();
    let url = `https://www.googleapis.com/customsearch/v1?key=${keys.key}&cx=${keys.cx}&q=${HTMLstring}`;

    // Query Google custom search engine
    $.ajax({
      method: "GET",
      url: url,
    }).done( (response) => {
      let items = response.items;
      for (var item of items) {
        // console.log(item.link);
        linkList.push(item.link);
      }
      catAss(linkList, triggerWords, catAssign, (id, link) =>{
        // console.log(id, link);
        let retObj = {'cat_id': id, 'link': link };
        cb(retObj);
      });
    });
  },
}
