const axios = require("axios");

module.exports = app => {
  app.post("/api/openAI", async (req, res) => {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/completions",
        {
          model: `gpt-3.5-turbo-instruct`,
          prompt: `The user is asking about open source projects on GitHub: ${req
            .body.question}`,
          max_tokens: 150
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );

      // Check for a successful status and the expected format in the response
      if (
        response.status === 200 &&
        response.data &&
        response.data.choices &&
        response.data.choices[0] &&
        response.data.choices[0].text
      ) {
        res.json({ answer: response.data.choices[0].text.trim() });
      } else {
        console.error("Unexpected response format from OpenAI:", response.data);
        res.status(500).send("Unexpected response format from OpenAI");
      }
    } catch (error) {
      console.error("Error interacting with OpenAI:", error);
      // Check if the error has a response from OpenAI
      if (error.response) {
        // OpenAI responded with an error. We can provide more detail.
        res.status(500).json({
          message: "Error interacting with OpenAI",
          apiResponse: error.response.data // send the detailed error message from OpenAI
        });
      } else {
        // This error occurred before making the request or after receiving a response
        res.status(500).send("Error interacting with OpenAI");
      }
    }
  });
};
