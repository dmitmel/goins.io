import { renderNunjucks } from '../lib/templates';
import users from '../models/users';

module.exports = {
    method:  'GET',
    path:    '/',
    handler: (req, res) => {
        if (users.hasUserCookie(req)) {
            res.send(renderNunjucks('index.nunjucks'));
        } else {
            res.redirect('/login');
        }
    }
};
