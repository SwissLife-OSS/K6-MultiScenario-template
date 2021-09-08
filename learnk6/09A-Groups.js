import http from 'k6/http';
import {group, sleep} from 'k6';

export let options = {
  discardResponseBodies: true,
  scenarios: {
    Scenario_GetCrocodiles: {
      exec: 'FunctionForThisScenario',
      executor: 'ramping-vus',
      startTime: '0s',
      startVUs: 5,
      stages: [
        { duration: '10s', target: 5 },
      ],
    },
    Scenario_GetContacts: {
      exec: 'FunctionGetContacts',
      executor: 'ramping-vus',
      startTime: '0s',
      startVUs: 5,
      stages: [
        { duration: '10s', target: 5 },
      ],
    },
  },
};

/* export default function () {
  http.get('https://test.k6.io/contacts.php');
} */

export function FunctionForThisScenario() {
  http.get('https://test-api.k6.io/public/crocodiles/');

 group('Do something and wait', function () {
    // ...
    DoSomethingAndWait();
  }); 

}

export function FunctionGetContacts() {
  

  group('Internal Group, lambda-like', ()=>{
    // do something

    group('Sleeping group, also nested...', ()=> {
      http.get('https://test.k6.io/contacts.php');

      sleep(3);
    });

    // do something more

  });
}

function DoSomethingAndWait() {
  // ...
  sleep(5);
}