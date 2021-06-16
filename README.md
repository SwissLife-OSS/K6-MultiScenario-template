# K6-Multi-Scenario-Template
It is a performance testing template that shows how to use K6 to implement a Multi Scenario template applying some best practices along some examples.


## Getting Started
Clone the code, [install K6](https://k6.io/docs/getting-started/installation/) and run the k6_multi_scenario_executor.bat and watch the outcome.
then learn the basics of K6, there are some code snippets for the main concepts (lifetime, VUs, Duration, checks, Thresholds, Stages, Executors, Scenarios).
And once you are familiar with them, go and look the K6_multi_scenario_template.js file which is the k6 template, and modify it to match your SUT (System Under Test).


## Features
The purpose of this project is to show how to put all the K6 techniques together while:
 - Applying some best practices.
 - Enabling a multiple test type execution (load, smoke, soak, stress...)
 - Enabling multiple scenario execution (understanding scenario as one concrete way to interact with a server). Ie, if it is a todo server we would like to:
    - login
    - logout
    - register
    - enter a new task
    - enter several tasks
    - retrieve the tasks for the day
    - delete a task
 - Enabling a secure code without secrets on it, and ready to integrate in a CI-CD pipeline without surprises.
 - Show how to implement the most common tasks (register, login, retrieve token, access REST api, access GraphQL api, retrieve and verify a web page).
 - show how to create and use tags & groups.
 - Show how to mix different Scenario executors (Ramping VUs & Ramping Arrival Rate)

The BackendFlowTest and the BackendReadTest as well as the Setup have been taken from the 'Advanced API Flow' example, located at [fabulous example section of k6.io](https://k6.io/docs/examples/advanced-api-flow/), with some modifications. All the credit is theirs :)

## Usage
To try it out, just open a command line with cmd.exe in windows in the root folder and type 'k6_multi_scenario_executor.bat'
It should execute the smoke test which will run several scenarios:
  - BackendRead_scenario, will read some information from a k6 test REST endpoint.
  - BackendFlow_scenario, will execute a complex scenario againsta  k6 test REST endpoint.
  - Frontend_scenario, will retrieve the k6.io page and check some of its content.
  - GraphQL_scenario, will access the Rick & Morty GraphQL API, retrieve all the human characters and do some checks.

Please note that https://rickandmortyapi.com/ is not meant for testing, so the usage in the code is limited to a single VU, so this does not cause a DOS attack to them.
So, please, be kind.

## Contribution
If you have an idea or suggestion, create an issue or, even better, implement it in a PR so we can improve it and add more functionality.

## Community

This project has adopted the code of conduct defined by the [Contributor Covenant](https://contributor-covenant.org/)
to clarify expected behavior in our community. For more information, see the [Swiss Life OSS Code of Conduct](https://swisslife-oss.github.io/coc).

