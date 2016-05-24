import test from 'ava';
import { handler as Skill } from '..';
import { Request } from 'alexa-annotations';
import nock from 'nock';

test('LaunchRequest', t => {
  const event = Request.launchRequest().build();

  return Skill(event).then(response => {
    t.deepEqual(response, {
      version: '1.0',
      response: {
        shouldEndSession: true,
        outputSpeech: { type: 'PlainText', text: 'Tstop launched!' }
      }
    });
  });
});

test('tstop intent', t => {
  const event = Request.intent('tstop').build();

  var hey = {
    stop_id: '70005',
    stop_name: 'Stony Brook - Inbound',
    mode: [
      {
      route_type: '1',
      mode_name: 'Subway',
      route: [
        {
        route_id: 'Orange',
        route_name: 'Orange Line',
        direction: [
          {
          direction_id: '0',
          direction_name: 'Southbound',
          trip: [
            {
              trip_id: '98660857',
              trip_name: 'Sullivan Square to Forest Hills',
              trip_headsign: 'Forest Hills',
              pre_dt: '1462064156',
              pre_away: '1031'
            }
          ]
          }
          ]
          }
        ]
        }
      ],
      alert_headers: [ ]
    };

  nock('http://realtime.mbta.com')
    .get('/developer/api/v2/predictionsbystop?api_key=wX9NwuHnZU2ToO7GmGR9uw&stop=70005&format=json')
    .reply(200, JSON.stringify(hey));

  return Skill(event).then(response => {
    t.deepEqual(response, {
      'version':'1.0',
      'response': {
        'shouldEndSession':true,
        'outputSpeech': {
            'type':'PlainText',
            'text':'your train should arrive in 17 minutes and 11 seconds.'
        },
        'card': {
          'title':'Trip time',
          'content':'your train should arrive in 17 minutes and 11 seconds.',
          'type':'Simple'
        }
      }
    });
  });
});

//TODO test error conditions line < 7 minute stop etc

