import http from 'k6/http';
import { sleep } from 'k6';

export function setup() {
	// 1. setup code
	console.log(`1.Setup Code. `); 
}

export default function(data){
		// 2. VU code
		console.log(`2.VU Code. `); 
		let result = http.get('https://test-api.k6.io/');
		
		sleep(1);
	} 

export function teardown(data) {
	// 3. teardown code
	console.log(`3.Teardown Code. `); 
}