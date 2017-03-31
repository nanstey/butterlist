let testArray = [
  'https://en.wikipedia.org/wiki/Cannibal_Corpse'
  'http://cannibalcorpse.net/',
  'https://www.discogs.com/artist/124774-Cannibal-Corpse',
  'https://www.youtube.com/watch?v=XAIX2vISe3M',
  'http://www.imdb.com/name/nm2472483/',
  'https://www.facebook.com/cannibalcorpse/',
  'http://www.imdb.com/title/tt1849737/',
  'https://twitter.com/corpseofficial?lang=en',
  'http://www.allmusic.com/artist/cannibal-corpse-mn0000545534',
  'https://www.last.fm/music/Cannibal+Corpse'
  ];

function extractDomain(url) {
    var domain;
    //find & remove protocol (http, ftp, etc.) and get domain
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    }
    else {
        domain = url.split('/')[0];
    }

    //find & remove port number
    domain = domain.split(':')[0];

    return domain;
}

console.log(extractDomain);

  // function catAss(array) {

  // }