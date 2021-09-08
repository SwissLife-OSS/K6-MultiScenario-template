import http from 'k6/http';
import { sleep } from 'k6';

export default function(){
	
		let result = http.get('https://test-api.k6.io/'); // or use http://test.k6.io/
		
		sleep(1);
} 