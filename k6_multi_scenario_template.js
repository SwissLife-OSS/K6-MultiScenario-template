import http from 'k6/http';
import {check, group, sleep, fail } from 'k6';
import { Counter, Trend } from 'k6/metrics';
import { parseHTML } from 'k6/html';

// Process arguments
var TOKEN_USERNAME = 'fakeuser'; // default
if (__ENV.TOKEN_USERNAME){
	TOKEN_USERNAME = __ENV.TOKEN_USERNAME;
}

var TOKEN_PASSWORD = 'fakepassword'; // default
if (__ENV.TOKEN_PASSWORD){
	TOKEN_PASSWORD = __ENV.TOKEN_PASSWORD;
}

var TEST_2_RUN = 'smoke'; // default
if (__ENV.TEST_2_RUN){
	TEST_2_RUN =  __ENV.TEST_2_RUN;
}

var ENV_2_RUN = 'dev'; // default
if (__ENV.ENV_2_RUN){
	ENV_2_RUN =  __ENV.ENV_2_RUN;
}

// Constants
const EnvToRun = {
	dev: 'dev',
	test: 'test',
	prod: 'prod'
}

// Parameters & Constants
const ENVIRONMENT = ENV_2_RUN;
const USERNAME =  `${randomString(10)}@example.com`; // TOKEN_USERNAME; 
const PASSWORD =  TOKEN_PASSWORD; 
const SampleURLWithEnvironment =  'https://.' + ENVIRONMENT + '.microsoft.appservice.com'; // just for reference
const BASE_URL = 'https://test-api.k6.io';
const GraphQL_RickNMorty_URL = 'https://rickandmortyapi.com/graphql'; // taken from https://rickandmortyapi.com/ 
const DEBUG = true;
const start = Date.now();

// Custom metrics 
// Counters
var sampleCounter = new Counter('sampleCounter');
var BackendReadCounter = new Counter('BackendReadCounter');
var SimpleUICounter = new Counter('SimpleUICounter');
// Trends
var sampleTrend_Trend = new Trend('sampleTrend_Trend');
var BackendRead_Trend = new Trend('BackendRead_Trend');
var SimpleUI_Trend = new Trend('SimpleUI_Trend');

const ExecutionType = {
    load:   'load',
    smoke:  'smoke',
    stress: 'stress',
    soak:   'soak'
  }

  var Execution = TEST_2_RUN; // ExecutionType.smoke;
  var ExecutionOptions_Scenarios;

  switch(Execution){
	case ExecutionType.smoke:
		ExecutionOptions_Scenarios = {
			BackendRead_scenario: {
                exec: 'BackendReadTest',
                executor: 'ramping-arrival-rate',
                startTime: '0s',
                startRate: 1,
                preAllocatedVUs: 4,
                stages: [
                { duration: '30s', target: 1},
                { duration: '30s', target: 2}
                ]
            },            
            BackendFlow_scenario: {
                exec: 'BackendFlowTest',
                executor: 'ramping-arrival-rate',
                startTime: '0s',
                startRate: 2,
                preAllocatedVUs: 8,
                stages: [
                { duration: '30s', target: 2},
                { duration: '30s', target: 4}
                ]
            },
            Frontend_scenario: {
                exec: 'FrontendSimpleTest',
                executor: 'ramping-vus',
                startTime: '0s',
                startVUs: 1,
                stages: [
                    { duration: '60s', target: 1 }
                ]
            },
            GraphQL_scenario: {
                exec: 'GraphQLEndpointTest',
                executor: 'ramping-vus',
                startTime: '0s',
                startVUs: 1,
                stages: [
                    { duration: '60s', target: 1 }
                ]
            }, 
        }; 
        break; // end case ExecutionType.smoke
    case ExecutionType.load:
        ExecutionOptions_Scenarios = {
            BackendRead_scenario: {
                exec: 'BackendReadTest',
                executor: 'ramping-arrival-rate',
                startTime: '0s',
                startRate: 1,
                preAllocatedVUs: 4,
                stages: [
                { duration: '30s', target: 2},
                { duration: '45m', target: 2}
                ]
            },            
            BackendFlow_scenario: {
                exec: 'BackendFlowTest',
                executor: 'ramping-arrival-rate',
                startTime: '0s',
                startRate: 2,
                preAllocatedVUs: 8,
                stages: [
                { duration: '30s', target: 4},
                { duration: '45m', target: 4}
                ]
            },
            Frontend_scenario: {
                exec: 'FrontendSimpleTest',
                executor: 'ramping-vus',
                startTime: '0s',
                startVUs: 1,
                stages: [
                    { duration: '45m', target: 1 }
                ]
            },
            GraphQL_scenario: {
                exec: 'GraphQLEndpointTest',
                executor: 'ramping-vus',
                startTime: '0s',
                startVUs: 1,
                stages: [
                    { duration: '45m', target: 1 }
                ]
            }, 
        }; 
        break; // end case ExecutionType.load    
    case ExecutionType.stress:
        ExecutionOptions_Scenarios = {
            BackendRead_scenario: {
                exec: 'BackendReadTest',
                executor: 'ramping-arrival-rate',
                startTime: '0s',
                startRate: 10,
                preAllocatedVUs: 160,
                stages: [
                { duration: '5m', target: 10},
                { duration: '5m', target: 20},
                { duration: '5m', target: 40},
                { duration: '5m', target: 80}
                ]
            },            
            BackendFlow_scenario: {
                exec: 'BackendFlowTest',
                executor: 'ramping-arrival-rate',
                startTime: '0s',
                startRate: 10,
                preAllocatedVUs: 160,
                stages: [
                    { duration: '5m', target: 10},
                    { duration: '5m', target: 20},
                    { duration: '5m', target: 40},
                    { duration: '5m', target: 80}
                ]
            },
            Frontend_scenario: {
                exec: 'FrontendSimpleTest',
                executor: 'ramping-vus',
                startTime: '0s',
                startVUs: 1,
                stages: [
                    { duration: '20m', target: 1 } // we don't want to stress these endpoints, not for stress testing - just for example so let's be kind ;)
                ]
            },
            GraphQL_scenario: { 
                exec: 'GraphQLEndpointTest',
                executor: 'ramping-vus',
                startTime: '0s',
                startVUs: 1,
                stages: [
                    { duration: '20m', target: 1 }  // we don't want to stress these endpoints, not for stress testing - just for example so let's be kind ;)
                ]
            }, 
        }; 
        break; // end case ExecutionType.stress    
    case ExecutionType.soak:
        ExecutionOptions_Scenarios = {
            BackendRead_scenario: {
                exec: 'BackendReadTest',
                executor: 'ramping-arrival-rate',
                startTime: '0s',
                startRate: 1,
                preAllocatedVUs: 40,
                stages: [
                { duration: '5m', target: 5},
                { duration: '5m', target: 10},
                { duration: '8h', target: 20}
                ]
            },            
            BackendFlow_scenario: {
                exec: 'BackendFlowTest',
                executor: 'ramping-arrival-rate',
                startTime: '0s',
                startRate: 1,
                preAllocatedVUs: 40,
                stages: [
                    { duration: '5m', target: 5},
                    { duration: '5m', target: 10},
                    { duration: '8h', target: 20}
                ]
            },
            Frontend_scenario: {
                exec: 'FrontendSimpleTest',
                executor: 'ramping-vus',
                startTime: '0s',
                startVUs: 1,
                stages: [
                    { duration: '8h', target: 1 } // we don't want to stress these endpoints, not for stress testing - just for example so let's be kind ;)
                ]
            },
            GraphQL_scenario: { 
                exec: 'GraphQLEndpointTest',
                executor: 'ramping-vus',
                startTime: '0s',
                startVUs: 1,
                stages: [
                    { duration: '8h', target: 1 }  // we don't want to stress these endpoints, not for stress testing - just for example so let's be kind ;)
                ]
            }, 
        }; 
        break; // end case ExecutionType.soak    
  }

export let options ={
    scenarios: ExecutionOptions_Scenarios,
    thresholds: {
        http_req_failed: ['rate<0.05'],   
        'http_req_duration': ['p(95)<500', 'p(99)<1500'],
        'http_req_duration{name:PublicCrocs}': ['avg<400'],
        'http_req_duration{name:k6SiteUIcheck}': ['avg<400'],
        'http_req_duration{name:Create}': ['avg<600', 'max<1000']       
    }
};  

function randomString(length) {
    const charset = 'abcdefghijklmnopqrstuvwxyz';
    let res = '';
    while (length--) res += charset[Math.random() * charset.length | 0];
    
    return res;
}

function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}  

function formatDate(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+ minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
  }

function DebugOrLog(textToLog){
    if (DEBUG){
        var millis = Date.now() - start; // we get the ms ellapsed from the start of the test
        var time = Math.floor(millis / 1000); // in seconds
        // console.log(`${time}se: ${textToLog}`); // se = Seconds elapsed
        console.log(`${textToLog}`); 
    }
}

// Testing the backend just with reads
export function BackendReadTest(authToken){
    var idCroc = getRandom(1,8);

    let res = http.get(
        `${BASE_URL}/public/crocodiles/1/`,
        {tags: {name: 'PublicCrocs'}}
    );

    const isSuccessfulRequest = check(res, {
        "Document request succeed": () => res.status == 200
    });

    if (isSuccessfulRequest){
        DebugOrLog(`response.body: ${res.body}`)
        BackendRead_Trend.add(res.timings.duration);
        BackendReadCounter.add(1);
        let body = JSON.parse(res.body);
        var age = body.age; 

        check(age, {
            'Crocs are older than 5 years of age': Math.min(age) > 5
        });
    }  
}    

// Testing the backend with an end-to-end workflow (essentially the advanced API Flow sample at https://k6.io/docs/examples/advanced-api-flow/)
export function BackendFlowTest(authToken){
  const requestConfigWithTag = tag => ({
    headers: {
      Authorization: `Bearer ${authToken}`
    },
    tags: Object.assign({}, {
      name: 'PrivateCrocs'
    }, tag)
  });

  group('Create and modify crocs', () => {
    let URL = `${BASE_URL}/my/crocodiles/`;

    group('Create crocs', () => {
      const payload = {
        name: `Name ${randomString(10)}`,
        sex: 'M',
        date_of_birth: '2001-01-01',
      };

      const res = http.post(URL, payload, requestConfigWithTag({ name: 'Create' }));

      if (check(res, { 'Croc created correctly': (r) => r.status === 201 })) {
        URL = `${URL}${res.json('id')}/`;
      } else {
        DebugOrLog(`Unable to create a Croc ${res.status} ${res.body}`);

        return
      }
    });

    group('Update croc', () => {
      const payload = { name: 'New name' };
      const res = http.patch(URL, payload, requestConfigWithTag({ name: 'Update' }));
      const isSuccessfulUpdate = check(res, {
        'Update worked': () => res.status === 200,
        'Updated name is correct': () => res.json('name') === 'New name',
      });

      if (!isSuccessfulUpdate) {
        DebugOrLog(`Unable to update the croc ${res.status} ${res.body}`);
        return
      }
    });

    const delRes = http.del(URL, null, requestConfigWithTag({ name: 'Delete' }));

    const isSuccessfulDelete = check(null, {
      'Croc was deleted correctly': () => delRes.status === 204,
    });

    if (!isSuccessfulDelete) {
        DebugOrLog(`Croc was not deleted properly`);
      return
    }
  });

  sleep(1);
}

export function FrontendSimpleTest(authToken) {
    let res = http.get(
        `${BASE_URL}/`,
        {tags: {name: 'k6SiteUIcheck'}}
    );

    const isSuccessfulRequest = check(res, {
        "Document request succeed": () => res.status == 200
      });

    if (isSuccessfulRequest){
        SimpleUI_Trend.add(res.timings.duration);
        SimpleUICounter.add(1);
        var doc = parseHTML(res.body); // equivalent to res.html()
        var pageTitle = doc.find('head title').text();
        var langAttr = doc.find('html').attr('lang');

        DebugOrLog(`title: ${pageTitle} lang attribute: ${langAttr}`)
        const checkLang = check(langAttr, {
            'language is english': langAttr == 'en'
        }); 

        const checkTitle = check(pageTitle, {
            'The title is correct': pageTitle == 'APIs demonstrating the power of k6'
        }); 

        if ((checkLang != true) || (checkTitle !=true)){
            DebugOrLog(`The title or language were wrong at ${BASE_URL}...`);
        }
    }  

    sleep(10);
  }

// Testing the backend just with reads
export function GraphQLEndpointTest(authToken){
    let headers = {
        // Authorization: `Bearer ${authToken}`, // This GraphQL server does not require authentication so we provide no token in the header
        'Content-Type': 'application/json',
      };
    let Query_allRicknMorty_Humans = ` 
    query{
        characters (filter: {species: "Human"}){
          results{
            id
            name
            status
            species
          }
        }
      }`;
    
    let res = http.post(
        GraphQL_RickNMorty_URL, 
        JSON.stringify({ query: Query_allRicknMorty_Humans }), 
        { headers: headers }
      );  
      
    const isSuccessfulRequest = check(res, {
        "HTML post succeed": () => res.status == 200
    });

    if (isSuccessfulRequest) {
        let body = JSON.parse(res.body);
        let errors = body.errors;
        let GraphQLerrors = false; 
        
        if (errors){
          DebugOrLog(`Found a GraphQL Error: ${errors[0].message}`); //Could be more than one, should iterate through them...
          GraphQLerrors = true; 
        }
        
        const hasNoGraphQLErrors = check(body, {
            "GraphQL request succeed": () => GraphQLerrors == false
        });	
        if (hasNoGraphQLErrors){
            DebugOrLog(`The response of the GraphQL API is:${res.body}`);    
            let name = body.data.characters.results[0].name;         
            DebugOrLog(`And the name of the first character is:${name}`);    
        }  
    }
    else	
    {
      DebugOrLog(`The http.Post failed!!!`);
    } 

    sleep(15);
}   


// setup configuration
export function setup() {
    DebugOrLog(`== SETUP BEGIN ===========================================================`)
    // log the date & time start of the test
    DebugOrLog(`Start of test: ${formatDate(new Date())}`)

    // log the test type
    DebugOrLog(`Test executed: ${Execution}`)

    // Log the environment
    DebugOrLog(`This test will run on the ${ENV_2_RUN} environment.`)

    // register a new user and authenticate via a Bearer token.
    let email = `${randomString(10)}@example.com`;
    let res = http.post(`${BASE_URL}/user/register/`, {
      first_name: 'Crocodile',
      last_name: 'Owner', 
      username: USERNAME,
      password: PASSWORD,
    }); 
  
    const isSuccessfulRequest = check(res, { 
        'created user': (r) => r.status === 201 
    }); //201 = created
  
    if (isSuccessfulRequest){
        DebugOrLog(`The user ${USERNAME} was created successfully!`);
    }
    else {
        DebugOrLog(`There was a problem creating the user ${USERNAME}. It might be existing, so please modify it on the executor bat file`);
        DebugOrLog(`The http status is ${res.status}`);        
        DebugOrLog(`The http error is ${res.error}`);        
    }

    let loginRes = http.post(`${BASE_URL}/auth/token/login/`, {
      username: USERNAME,
      password: PASSWORD
    });
     
    let authToken = loginRes.json('access');
    let logInSuccessful = check(authToken, { 
        'logged in successfully': () => authToken !== '', 
    });

    if (logInSuccessful){
        DebugOrLog(`Logged in successfully with the token: ${authToken}`); 
    }

    DebugOrLog(`== SETUP END ===========================================================`)

    return authToken; // this will be passed as parameter to all the exported functions
}