import path from 'path';
import {Router} from 'express';
import wixRenderer from 'wix-renderer';
import wixRunMode from 'wix-run-mode';
import wixExpressRenderingModel from 'wix-express-rendering-model';

module.exports = ({rpc, basename, config}) => {
  const app = new Router();

  if (process.env.NODE_ENV === 'development') {
    app.use(require('./fake-server'));
  }

  app.get('/sites', (req, res) => {
    rpc.metasite(req.aspects).listMetasites(req.aspects.session.userGuid)
      .then(response => res.send(response));
  });

  app.get('*', (req, res) => {
    const templatePath = path.resolve('./src/index.ejs');
    const data = {basename};

    wixExpressRenderingModel.generate(req, config).then(renderModel => {
      wixRenderer
        .render(templatePath, renderModel, data, wixRunMode.isProduction())
        .then(html => res.send(html));
    });
  });

  return app;
};
