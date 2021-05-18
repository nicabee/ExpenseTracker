const express = require("express");
const app = express();
const initWebRoutes = require("./routes/routes");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static("public"));



initWebRoutes(app);

app.listen(8080);