import templates from '../lib/templates';
import users from '../models/users';

module.exports = {
    method: 'GET',
    path: '/',
    handler: (req, res) => {
        if (users.hasUserCookie(req)) {
            const language = templates.getLanguage(req);
            res.cookie('lang', language);
            res.send(templates.renderNunjucks('index.njk', {
                language,
                i18n: templates.i18ns[language]
            }));
        } else {
            res.redirect('/login');
        }
    }
};
