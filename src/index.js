import express from 'express';
import path from 'path';
import { readdirRecursiveSync } from './lib/path'; // eslint-disable-line no-unused-vars
import { throwWithMessage } from './lib/exceptions';
import cookieParser from 'cookie-parser';
import templates from './lib/templates';
import _ from 'underscore';
import { loadUsers } from './models/users';
import logger from 'morgan';
// import bodyParser from 'body-parser';
import methodOverride from 'method-override';
// import { getLocalIP } from './lib/http';
import { statusCodes } from './lib/http';
import { inspect } from 'util';

const port = 8080;
const host = 'localhost';
// const host = getLocalIP('en0');
const app = express();

app.use(logger(
    ':remote-addr - :remote-user [:date[web]] ":method :url HTTP/:http-version" - :status - ' +
    ':res[content-length] bits, :response-time ms'
));
app.use(express.static('public'));
// app.use(bodyParser());
app.use(methodOverride());
app.use(cookieParser({
    path: '/'
}));

templates.initTemplateEngine();
loadUsers();

const controllersDir = path.join(__dirname, 'controllers');
_(_(readdirRecursiveSync(controllersDir)).filter(file => path.extname(file) === 'js')).each(file => {
    const controllerName = path.basename(file, path.extname(file));
    const controller = require(file); // eslint-disable-line global-require

    const method = controller.method.toLowerCase() || 'all';
    const path_ = controller.path || throwWithMessage(
        `index.js: No path provided for controller '${controllerName}'. ` +
        'Please, use field \'path\'.');
    const handler = controller.handler || throwWithMessage(
        `index.js: No handler provided for controller '${controllerName}'. ` +
        'Please, use field \'handler\'.');
    app[method](path_, handler);
});


app.use((req, res) => {
    res.status(statusCodes.NOT_FOUND);
    res.send(templates.renderNunjucks('errors/404.nunjucks', {
        url: req.path
    }));
});

app.listen(port, host, () => {
    console.log(`\nServer started on http://${host}:${port}/`);
});
