function catAss(uberString) {
  let cat_id = 4;
  if (uberString.includes('movie' || 'tv' || 'show' || 'film' || 'series')) {
    cat_id = 1;
  } else if (uberString.includes('paper' || 'author' || 'read' || 'novel' || 'books')) {
    cat_id = 2;
  } else if (uberString.includes('food' || 'eat' || 'drink' || 'restaurant' || 'cafe')) {
    cat_id = 3;
  } else if (uberString.includes('music' || 'band' || 'artist' || 'song' || 'concert')) {
    cat_id = 5;
  }
  return cat_id;
}


function listQuery (itemQuery){
  let searchString = query.toLowerCase();
  let linkList = [];
  $(() => {
    $.ajax({
      method: "GET",
      url:`https://www.googleapis.com/customsearch/v1?key=AIzaSyAdslr-npcuLlN7_7-QmRV8wnVVHjgGKJ4&cx=011814553479746519374:at46p1fcles&q=${itemQuery}&callback=hndlr`
    }).done((response) => {
        for (var i = 0; i < response.items.length; i++) {
          linkList.push(item.link);
          searchString += (' ' + item.snippet + ' ' + item.title + ' ');
        }

        let retObj = {'cat_id': catAss(searchString), 'link': linkList[0]};
        return retObj;
      }
    });;
  });
}


console.log(listQuery(rickandmorty));
