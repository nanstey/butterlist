

module.exports = {
  listQuery: function(params){
    let itemQuery = params;
    let linkList = [];
    $(() => {
      $.ajax({
        method: "GET",
        url:`https://www.googleapis.com/customsearch/v1?key=AIzaSyAdslr-npcuLlN7_7-QmRV8wnVVHjgGKJ4&cx=011814553479746519374:at46p1fcles&q=${itemQuery}&callback=hndlr`
      }).done((response) => {
          for (var i = 0; i < response.items.length; i++) {
            linkList.push(item.link);
          }
          let retObj = {'cat_id':1, 'link': linkList[0]};
          return retObj;
        }
      });;
    });
  }
}

