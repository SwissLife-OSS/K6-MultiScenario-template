// login
k6 cloud login -t $K6_CLOUD_TOKEN

// use in the cloud
k6 cloud script.js
k6 cloud learnk6/06-Scenarios.js

// or locally and stream the result to the cloud 
// check https://grafana.com/docs/k6/v0.54.x/release-notes/v0.54.0/
k6 cloud run --local-execution learnk6/06-Scenarios.js
