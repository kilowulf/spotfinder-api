const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const cors = require("cors");
const graphqlServer = require("./services/faqGraphQlService");

require("dotenv").config();

// ensure proper order of operations with these imports
require("./models/user");
require("./services/passport");

// connect to mongoDB
mongoose.connect(process.env.MONGO_URI);

// Get the connection object
const db = mongoose.connection;

// Bind to the 'error' event to get notified of connection errors
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Bind to the 'connected' event to get notified when connection is established
db.once("connected", () => {
  console.log("Successfully connected to MongoDB");
});

// Bind to the 'disconnected' event to get notified when disconnected
db.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
});

const app = express();

app.use(bodyParser.json());

// cors
app.use(
  cors({
    origin: ["https://spotfinder-client.vercel.app"],
    methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"],
    credentials: true
  })
);

// Adding CSP header middleware
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; font-src 'self' data:; connect-src 'self';"
  );
  next();
});

// middleware for cookie-session
app.use(
  cookieSession({
    // set duration of cookie milliseconds
    maxAge: 30 * 24 * 60 * 60 * 1000,
    // encrypt cookie
    keys: [process.env.COOKIE_KEY]
  })
);

// Function to start Apollo Server and apply middleware
async function startServer() {
  await graphqlServer.start();
  graphqlServer.applyMiddleware({ app, path: "/graphql" }); // Specify the path here
}

startServer();

// set passport to use cookies
// create passport instance on req object
app.use(passport.initialize());
// check for user object, passes to deserializeUser to retrieve full user object
app.use(passport.session());

// calling function from auth_routes.js and passing app as argument
require("./api/oauthRoute")(app);
require("./api/routes/userRoutes")(app);
require("./api/routes/searchGithubRoute")(app);
require("./api/routes/openAIRoute")(app);

// Ensure production assets are served when hosted
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"));
//   // Express serves index.html file if it doesn't recognize route
//   const path = require("path");
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }

// troubleshoot vercel deployment connection
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://spotfinder-api.vercel.app"
    : "http://localhost:5000";

// Log the API URL and environment to confirm correct values
console.log("API Base URL:", API_BASE_URL);
console.log("Environment:", process.env.NODE_ENV);

axios
  .get(`${API_BASE_URL}/api/your-endpoint`)
  .then(response => {
    // Log the response for debugging
    console.log("API Response:", response);

    // Handle the successful response
    // For example, you might update the state with the response data
  })
  .catch(error => {
    // Log the error details for troubleshooting
    console.error("API Request Failed:", error);

    // Log specific error details
    if (error.response) {
      // The request was made, and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Status Code:", error.response.status);
      console.error("Response Data:", error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No Response Received:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error Message:", error.message);
    }
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT);
