import fetch from 'isomorphic-fetch';

export default class MBTAAPI {
  constructor(){
    this.BASE_URL = 'http://realtime.mbta.com/developer/api/v2';
    this.api_key = 'wX9NwuHnZU2ToO7GmGR9uw';
    this.stop_id = '70005';
  }

  get_predictions(){
    console.log(this.url('predictionsbystop'));
    return fetch(this.url('predictionsbystop')).then(function(response){
      // no lambda cuz sometimes stuff breaks and converting back and forth
      // is annoying
      return response.json();
    });
  }

  url(path_fragment){
    return `${this.BASE_URL}/${path_fragment}?api_key=${this.api_key}&stop=${this.stop_id}&format=json`;
  }
}
