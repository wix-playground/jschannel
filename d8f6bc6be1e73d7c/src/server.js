/*
Staging:
user_id: f70622ef-5840-45dd-8af9-e647ef8fcc3d
app_id: 7681130653390347
app_key: 7112f431568541fcba83add6afbb112c
staging endpoint for uploading: wixprivatemedia-staging.appspot.com
staging endpoint for serving: static-dev.wixstatic.com
*/
import {Router} from 'express';
import wixRenderer from 'wix-renderer';
import wixRunMode from 'wix-run-mode';
import wixExpressRenderingModel from 'wix-express-rendering-model';
import multer from 'multer';
import wixExpressTimeout from 'wix-express-timeout';
import credentials from './server/credentials/api';
import Uploader from './server/uploader';

const uploadMiddleware = multer({storage: multer.memoryStorage()});
const uploader = new Uploader(credentials);

module.exports = ({config, basename}) => {
  const app = new Router();

  app.use(wixExpressTimeout.get(1000 * 60));

  app.get('/', (req, res) => {
    wixExpressRenderingModel.generate(req, config)
      .then(renderModel =>
        wixRenderer.render(
          './src/index.ejs',
          renderModel,
          {title: 'Creative mornings', basename},
          wixRunMode.isProduction()
        )
      )
      .then(html => res.send(html));
  });

  app.post('/', uploadMiddleware.single('file'), (req, res) => {
    const meta = Object.assign({}, JSON.parse(req.body.meta));
    meta.uuid = req.aspects.session ? (req.aspects.session.userGuid || null) : null;

    if (req.file.size > 24 * 1024 * 1024) {
      res.status(413).end();
      return;
    }
    uploader.do(req.file, meta, (ok, step, meta) => {
      res
        .status(ok ? 200 : 500)
        .send(ok ? {step, meta} : null)
        .end();
      delete req.files;
    });
  });

  return app;
};
