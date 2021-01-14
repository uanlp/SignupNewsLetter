const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
const client = require("@mailchimp/mailchimp_marketing");
const { response } = require("express");

const app = express();
app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

client.setConfig({
  apiKey: "YOUR API KEY",
  server: "YOUR SERVER",
});

app.post("/", function (req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
  };

  const run = async () => {
    const response = await client.lists.addListMember("YOUR LIST ID", {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName,
      },
    });
  };
  console.log(response.statusCode);
  //Check if the process works
  if (response.statusCode === 200) {
    res.sendFile(__dirname + "/success.html");
  } else {
    res.sendFile(__dirname + "/failure.html");
  }
  run();
});

app.post("/failure", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

//the server heroku will pick a port for this app on its server. || helps this app runs locally as well.
app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000.");
});
