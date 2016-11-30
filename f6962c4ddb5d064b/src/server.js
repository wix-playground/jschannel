import {Router} from 'express';
import wixRenderer from 'wix-renderer';
import wixRunMode from 'wix-run-mode';
var ReactDOMServer = require('react-dom/server');
import wixExpressRenderingModel from 'wix-express-rendering-model';
var React = require('react');
var App = React.createFactory(require('./App.js'));
var fetch = require('node-fetch');
const ImagesClient = require('google-images');
const cors = require('cors');


module.exports = ({config}) => {
    const app = new Router();
    app.use(cors());


    app.get('/', (req, res) => {
        fetch('http://static.parastorage.com/services/editor-platform-app-configuration/1.7.0/data/appsConfig.json')
        //fetc(`${config.services.appsConfigPath}/data/appsConfig.json`)
            .then(function(res) {
                return res.text();
            }).then(function(results) {
            var props = {
                itemsAsString: results
            }


            const templatePath = './src/index.ejs';
            const data = {
                title: 'editor platform app configuration',
                props: JSON.stringify(props),
                body: ReactDOMServer.renderToString(App(props))
            };

            wixExpressRenderingModel.generate(req, config).then(renderModel => {
                wixRenderer
                    .render(templatePath, renderModel, data, wixRunMode.isProduction())
                    .then(html => res.send(html));
            });
        });
    });

    app.get('/images/:keyword', (req, res) => {
        let client = new ImagesClient('008180785785729688609:ypismfxkify', 'AIzaSyBhzhtWMMTsRp-ojMtzxcs6OBJ8NZvdlXU');
        client.search(req.params['keyword'])
            .then(function (images) {
                res.send(images);
            });
    });

    return app;
};
