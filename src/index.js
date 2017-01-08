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
import requestLanguage from 'express-request-language';

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
app.use(requestLanguage({
    languages: ['ru-RU', 'uk-UA']
}));

loadUsers();

const controllersDir = path.join(__dirname, 'controllers');
_.each(_.filter(readdirRecursiveSync(controllersDir), file => path.extname(file) === '.js'), file => {
    const controllerName = path.basename(file, path.extname(file));
    const controller = require(file); // eslint-disable-line global-require

    const method = controller.method.toLowerCase() || 'all';
    const _path = controller.path || throwWithMessage(
        `index.js: No path provided for controller '${controllerName}'. ` +
        'Please, use field \'path\'.');
    const handler = controller.handler || throwWithMessage(
        `index.js: No handler provided for controller '${controllerName}'. ` +
        'Please, use field \'handler\'.');

    app[method](_path, handler);
});


app.use((req, res) => {
    res.status(statusCodes.NOT_FOUND);
    const language = templates.getLanguage(req);
    res.cookie('lang', language);
    res.send(templates.renderNunjucks('errors/404.njk', {
        url: req.path,
        language,
        i18n: templates.i18ns[language]
    }));
});

app.listen(port, host, () => {
    console.log(`\nServer started on http://${host}:${port}/`);
});
