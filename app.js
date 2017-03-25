/**
 * Copyright  2017 Harshit Pant
 * license : MIT
 */

// Importing all the dependencies
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const http = require('http');
const https = require('https');

// Initializing app to a variable
const app = express();

// Cheecking the environment
const debug = process.env.NODE_ENV !== "production";

if(debug){
  app.use(morgan("common"));
}
// Importing our routes
const routes = require('./routes/index');
const admin = require('./routes/admin')

// Setting the view engine to Embedded JavaScript (EJS)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Setting up bodyParser MW
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Setting up the routes
app.use('/static', express.static(path.join(__dirname, 'static'))) // Static folder
app.use('/admin', admin);
app.use('/', routes);


// Production
if (!debug) {
  // HTTP to HTTPS logic
  function ensureSecure(req, res, next) {
    if (req.secure)
      next();
    else {
      res.status(301).redirect('https://' + 'blog.nxtshare.co.in' + req.url);
    }
  }

  app.all('*', ensureSecure)

  const PORT = process.env.PORT || 3443;
  const HTTP_PORT = process.env.HTTP_PORT || 8080;

  http.createServer(app).listen(HTTP_PORT, () => {
    console.log('HTTP service started on PORT ' + HTTP_PORT);
  });

  let options = {
    key: fs.readFileSync('/home/deploy/certs/key.pem'),
    cert: fs.readFileSync('/home/deploy/certs/cert.pem')
  }

  https.createServer(options, app).listen(PORT, () => {
    console.log('HTTPS service started on PORT ' + PORT);
  });

}
else {
  // Starting our app
  app.listen(8080, () => {
    console.log("http://localhost:8080");
  })

}