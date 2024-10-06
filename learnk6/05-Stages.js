import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
  thresholds: {
	  "http_req_duration": [{
		  threshold: "p(95)<200"
	  }],
	  "checks": [{
		  threshold: "rate>0.9"
	  }]
  },
  stages: [
    { duration: '2s', target: 5 },
	{ duration: '3s', target: 10 },
	{ duration: '3s', target: 5 },
	{ duration: '2s', target: 1 }
  ]
};

export default function(){
	let result = http.get('https://test-api.k6.io/public/crocodiles/');
	
	check(result, {
		"Status is 200": (r) => r.status == 200,
		"Duration < 600ms": (r) => r.timings.duration < 600
	});
	
	sleep(1);
}

