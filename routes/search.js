const jsdom = require('jsdom');
const $ = require('jquery')(jsdom.jsdom().defaultView);

// Noel's cx      = 002722805530366229806:-t-5uikfp5u
// Noel's key     = AIzaSyCWqmdprHP_z1yZSqJQsld_n5cXULAhEPw
// Wyatt's cx     = 011814553479746519374:at46p1fcles
// Wyatt's key    = AIzaSyAdslr-npcuLlN7_7-QmRV8wnVVHjgGKJ4
// Paige's cx     = 007555445453685937442:zjbtlh-ohdo
// Paige's key    = AIzaSyCWHfE06eMEutn-3LnhU_QUI1isU2B3src

const apiKeys =
  [
    {'cx': '002722805530366229806:-t-5uikfp5u', 'key': 'AIzaSyCWqmdprHP_z1yZSqJQsld_n5cXULAhEPw' },
    {'cx': '011814553479746519374:at46p1fcles', 'key': 'AIzaSyAdslr-npcuLlN7_7-QmRV8wnVVHjgGKJ4' },
    {'cx': '007555445453685937442:zjbtlh-ohdo', 'key': 'AIzaSyCWHfE06eMEutn-3LnhU_QUI1isU2B3src' }
  ];

let keyPos = 0;

function getKeys() {
  let keys = apiKeys[keyPos];
  keyPos = (keyPos + 1) % apiKeys.length;
  return keys;
}


const triggerWords =
  [
    ['imdb','tv','movie','theatre','series','film','actor'],
    ['music','discogs','artist','allmusic'],
    ['book','indigo','chapters','novel','read'],
    ['food','yelp','tripadvisor','drink','pizza','beer'],
    ['products','amazon','walmart']
  ];

function catAss(linkList, keywords, cb) {
  let countArray = [[],[],[],[],[]];
  console.log('were in catAss and keywords is ' + keywords);
  let cat_id = 0;
  for(var i =0; i < linkList.length;i++) {
    for (var j=0; j < keywords.length; j++) {
      for (var k=0; k< keywords[j].length; k++) {
        if (linkList[i].includes(keywords[j][k])){
          countArray[j].push(linkList[i]);
          console.log(countArray);

        }
      }
    }
  }
  let max = 0;
  let maxPos = 0;
  for (var i = 0; i < countArray.length; i++){
    console.log('i = ' + i);
    if (countArray[i].length > max) {
      max = countArray[i].length;
      maxPos = i;
      console.log("max is " + max)
    }
  }
  cat_id = maxPos +1;
  link = countArray[maxPos][0];
  return cb(cat_id, link);
}

module.exports = {
  listQuery: function(itemQuery, cb){
    console.log('were in listQuery');
    let HTMLstring = itemQuery.replace(" ", "+");
    let linkList = [];
    let keys = getKeys();
    let url = `https://www.googleapis.com/customsearch/v1?key=${keys.key}&cx=${keys.cx}=${HTMLstring}`

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
