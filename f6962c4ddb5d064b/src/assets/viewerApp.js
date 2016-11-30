function getImages($w, tag) {
    fetch('http://apps.wix.com/editor-platform-app-configuration-ui-node/images/' + tag)
        .then(function(res) {
            return res.json();
        }).then(function(results) {
            let urls = [];
            results.forEach( i => urls.push({src: i.url}));
            $w("@gallery").images = urls;
        }
    )
}

function initAppForPage () {
    return Promise.resolve();
}

function createControllers (controllerConfigs) {
    return controllerConfigs.map(function (_ref) {
        var type = _ref.type;
        var config = _ref.config;
        return controllerByType[type] ? Promise.resolve(controllerByType[type](config)) : Promise.reject(new Error('Unknown controller type [' + type + ']'));
    });
}

var controller = function () {
    return {
        pageReady: function start($w) {
            $w('@input').value = "mlb playoffs";
            $w('@input').onBlur((e) => {
                getImages($w, e.comp.value);
            });
            getImages($w, 'mlb%20playoffs');
        }
    }
};

var controllerByType = {
    widgetType: controller
};

module.exports = {
    initAppForPage: initAppForPage,
    createControllers: createControllers
};