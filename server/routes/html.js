import fs from 'fs';
import url from 'url';
import ejs from 'ejs';
import path from 'path';
import nconf from 'nconf';

export default () => {
  const template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <title>Auth0 - GitHub Deploy</title>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="shortcut icon" href="https://cdn.auth0.com/styleguide/4.6.13/lib/logos/img/favicon.png">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/styles/zocial.min.css">
    <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/manage/v0.3.1715/css/index.min.css">
    <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/styleguide/4.6.13/index.css">
    <% if (assets.style) { %><link rel="stylesheet" type="text/css" href="/app/<%= assets.style %>"><% } %>
    <% if (assets.version) { %><link rel="stylesheet" type="text/css" href="//cdn.auth0.com/extensions/auth0-github-deploy/assets/auth0-github-deploy.ui.<%= assets.version %>.css"><% } %>
  </head>
  <body class="a0-extension">
    <div id="app"></div>
    <script type="text/javascript" src="//cdn.auth0.com/js/lock-9.0.min.js"></script>
    <script type="text/javascript" src="//cdn.auth0.com/manage/v0.3.1715/js/bundle.js"></script>
    <script type="text/javascript">window.config = <%- JSON.stringify(config) %>;</script>
    <% if (assets.vendors) { %><script type="text/javascript" src="/app/<%= assets.vendors %>"></script><% } %>
    <% if (assets.app) { %><script type="text/javascript" src="/app/<%= assets.app %>"></script><% } %>
    <% if (assets.version) { %>
    <script type="text/javascript" src="//cdn.auth0.com/extensions/auth0-github-deploy/assets/auth0-github-deploy.ui.vendors.<%= assets.version %>.js"></script>
    <script type="text/javascript" src="//cdn.auth0.com/extensions/auth0-github-deploy/assets/auth0-github-deploy.ui.<%= assets.version %>.js"></script>
    <% } %>
  </body>
  </html>
  `;

  return (req, res, next) => {
    if (req.url.indexOf('/api') === 0) {
      return next();
    }

    const config = {
      AUTH0_DOMAIN: nconf.get('AUTH0_DOMAIN'),
      AUTH0_CLIENT_ID: nconf.get('AUTH0_CLIENT_ID'),
      IS_ADMIN: req.path === '/admins',
      BASE_URL: url.format({
        protocol: nconf.get('NODE_ENV') !== 'production' ? 'http' : 'https',
        host: req.get('host'),
        pathname: url.parse(req.originalUrl || '').pathname.replace(req.path, '')
      }),
      BASE_PATH: url.parse(req.originalUrl || '').pathname.replace(req.path, '') + (req.path === '/admins' ? '/admins' : '')
    };

    // Render from CDN.
    const clientVersion = nconf.get('CLIENT_VERSION');
    if (clientVersion) {
      return res.send(ejs.render(template, {
        config,
        assets: { version: clientVersion }
      }));
    }

    // Render locally.
    return fs.readFile(path.join(__dirname, '../../dist/manifest.json'), 'utf8', (err, data) => {
      const locals = {
        config,
        assets: {
          app: 'bundle.js'
        }
      };

      if (!err && data) {
        locals.assets = JSON.parse(data);
      }

      // Render the HTML page.
      res.send(ejs.render(template, locals));
    });
  };
};
