const express = require("express");
const { searchGithub } = require("../services/githubSearchQuery");

module.exports = app => {
  console.log("Loading github search route");
  app.post("/api/github_search", async (req, res) => {
    try {
      console.log("received request on github-search route");
      const searchParameters = req.body; // Assuming you're sending the query parameters in the request body
      const results = await searchGithub(searchParameters);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch data from GitHub" });
    }
  });
};
