const triggerWords = [
                  ['tv','movie','theatre','series','film','actor']
                  ['book','indigo','chapters','novel','read'],
                  ['food','yelp','tripadvisor','drink','pizza','beer'],
                  ['products','amazon','walmart'],
                  ['music','discogs','artist','allmusic'],
                  ];

function catAss(array, keywords) {
  let cat_id = 0;
  for(var i =0; i < array.length;i++) {
    for (var j=0; j < keywords.length; j++) {
      for (var k=0; k< keywords[j].length; k++) {
        if (array[i].includes(keywords[j][k])){
          return cat_id = j + 1;
        }
      }
    }

  }
}
