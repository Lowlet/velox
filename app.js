const express = require('express');
const expressHbs = require('express-handlebars');
const sassMiddleware = require('node-sass-middleware');
const postcssMiddleware = require('postcss-middleware');
const autoprefixer = require('autoprefixer');

const routes = require('./routes/routes');

const path = require('path');
const PORT = process.env.PORT || 3000;

const app = express();
const hbs = expressHbs({
    extname: 'hbs',
    defaultLayout: 'main'
});

app.engine('hbs', hbs);
app.set('view engine', 'hbs');

app.use(sassMiddleware({
    src: path.join(__dirname, 'scss'),
    dest: path.join(__dirname, 'public/styles'),
    outputStyle: 'compressed',
    debug: true,
    force: true,
    prefix: '/styles',
    //sourceMap: true
}));

app.use('public/styles', postcssMiddleware({
    plugins: [autoprefixer()],
    src: (req) =>
    {
        return path.join(__dirname, 'public/styles', req.url);
    }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(routes);

app.listen(PORT, () =>
{
    console.log('Server has been started');
})