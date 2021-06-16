import http from 'k6/http';

export let options = {
  discardResponseBodies: true,
  scenarios: {
    contacts: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '5s', target: 25 },
        { duration: '5s', target: 0 },
      ],
    },
  },
};

export default function () {
  http.get('https://test.k6.io/contacts.php');
}
