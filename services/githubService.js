// services/githubService.js

const { ApolloClient, InMemoryCache, HttpLink } = require("@apollo/client");
const fetch = require("node-fetch");
//import fetch from "node-fetch";

const GITHUB_GRAPHQL_ENDPOINT = "https://api.github.com/graphql";

const httpLink = new HttpLink({
  uri: GITHUB_GRAPHQL_ENDPOINT,
  headers: {
    authorization: `Bearer ${process.env.PERSONAL_ACCESS_TOKEN}`
  },
  fetch
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});

module.exports = client;
