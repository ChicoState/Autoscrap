// hello_algolia.js
const algoliasearch = require('algoliasearch')
const config = require('./privatekeys/algolia.json')

// Connect and authenticate with your Algolia app
const client = algoliasearch(config.appID, config.apiKey)

// Create a new index and add a record
const index = client.initIndex('autoscrapPosts')

// Search the index and print the results
index
  .search('helloWorld')
  .then(({ hits }) => console.log(hits[0]))
