import { Skill, Launch, Intent } from 'alexa-annotations';
import { say, ask } from 'alexa-response';
import { ssml } from 'alexa-ssml';
import MBTAAPI from './mbta_api';
import _ from 'lodash';

@Skill
export default class Tstop {

  constructor(){
    this.mbta_api = new MBTAAPI();
  }

  @Launch
  launch() {
    return say('Tstop launched!');
  }

  @Intent('tstop')
  tstop(){
    return this.getNextTrain();
  }

  getNextTrain(){

    var minTime = 7*60;

    var that = this;
    return this.mbta_api.get_predictions().then(function(response){
        //TODO: if I want to support stops with multiple mode, route, or direction types I'll need to rewrite this
        var trips = _.get(response, 'mode[0].route[0].direction[0].trip', []);
        var validTripTimes = trips.map(trip => parseInt(trip.pre_away)).filter(time => time > minTime);

        if (validTripTimes.length){
          var message = `your train should arrive in ${that.formatTime(validTripTimes[0])}`;
          return say(message).
                 card( {title: 'Trip time', content: message});
        } else {
          return say('I couldn\'t find any valid trains under your time threshold');
        }
    });
  }

  formatTime(seconds){
    return `${Math.floor(seconds / 60)} minutes and ${seconds %60} seconds.`;
  }

  @Intent('AMAZON.HelpIntent')
  help() {
    return ask('I say hello to people. Who should I say hello to?').reprompt('Who should I say hello to?');
  }

  @Intent('AMAZON.CancelIntent', 'AMAZON.StopIntent')
  stop() {
    return say(<speak>Goodbye!</speak>);
  }

}
