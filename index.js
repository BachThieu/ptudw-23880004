'use strict'

const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const expressHandlebars = require('express-handlebars');

// cau hinh public static folder
app.use(express.static(__dirname +'/public'));

//Cau hinh su dung handlebars
app.engine('hbs',expressHandlebars.engine({
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    extname: 'hbs',
    defaultLayout: 'layout',
}));
app.set('view engine', 'hbs');

// routes
app.get('/', (req, res) => {
   res.render('index');
});

app.get('/:page', (req, res) => {
    res.render(req.params.page);
    });
    
// khoi dong web server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});