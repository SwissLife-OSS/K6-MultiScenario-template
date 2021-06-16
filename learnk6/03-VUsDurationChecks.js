import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
  vus: 2,
  duration: "5s"
}

export default function(){
	
		let result = http.get('https://test-api.k6.io/');
		
		check(result, {
			"Status is 200": (r) => r.status == 200,
			"Duration < 500ms": (r) => r.timings.duration < 500
		});
		
		sleep(1);
}

