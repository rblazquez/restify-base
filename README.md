restify-base
============

## Boilerplate setup for building a [Node.js](http://nodejs.org/) RESTful API server with [restify](http://mcavage.github.io/node-restify/).


## Included

This project will set up the basic structure for restify including setting up a [YAML configuration file](https://github.com/rjyo/yaml-config-node), logging with [bunyan](https://github.com/trentm/node-bunyan), and testing with [mocha](http://mochajs.org/) and [supertest](https://github.com/visionmedia/supertest). The server will spawn a worker for each CPU using node's [cluster module](http://nodejs.org/docs/latest/api/cluster.html).

It includes several tools and configuration to enforce following coding best practices:

- [ESLint] (http://eslint.org/)
- [JSCS] (http://jscs.info/overview)
- [JSHint] (http://jshint.com/)

That are compatible with most modern IDEs

Is set up to use [forever](https://github.com/nodejitsu/forever) for ensuring the process runs continuously


## Usage

You should use `npm start` and `npm stop` to start and stop server  correctly.

Start process will spawn a worker for each CPU using node's [cluster module](http://nodejs.org/docs/latest/api/cluster.html).

Also note that `npm run-script list` will list out the forever processes that are running.

1. Customize the [`package.json`](https://npmjs.org/doc/files/package.json.html) file with appropriate name, version, and dependency versions.
2. Install dependencies: `npm install -d`
3. Run it: `npm start`

## Loging

By default [node-bunyan](https://github.com/trentm/node-bunyan) is used for logging to a files:
 - (`./logs/{{SERVER_NAME}}-{{errors}}.json`)
 - (`./logs/{{SERVER_NAME}}-{{log}}.json`)

## Testing

There is an example of testing the example route in the `test` directory. Run all test specifications with mocha using: `npm test`


## Enviroments

`NODE_ENV` is used to allow different behaviour for development / production. 

`$NODE_ENV=production` will create a cluster otherwise it will spawn one only server.

## Extending

Look at the `controller` folder to include more routes and extend functionality.


