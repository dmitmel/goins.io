import templates from '../lib/templates';
import users from '../models/users';

module.exports = {
    method: 'GET',
    path: '/log-in',
    handler: (req, res) => {
        const language = templates.getLanguage(req);
        res.cookie('lang', language);
        res.send(templates.renderNunjucks('login.njk', {
            switchAccount: users.hasUserCookie(req),
            language,
            i18n: templates.i18ns[language]
        }));
    }
};
