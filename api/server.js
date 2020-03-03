const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 4000;
const cors = require('cors');
const dashboardlogic = require('./dashboarlogic.js');
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/dashboard', dashboardlogic);
app.listen(PORT, function(){
  console.log('Server is running on Port:',PORT);
});
