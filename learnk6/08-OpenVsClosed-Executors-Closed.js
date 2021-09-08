import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
  discardResponseBodies: true,
  scenarios: {
    contacts: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '10s', target: 5 },
        { duration: '10s', target: 10 },
      ],
    },
  },
};

export default function () {
  http.get('https://test.k6.io/contacts.php');

  sleep(5);
}
