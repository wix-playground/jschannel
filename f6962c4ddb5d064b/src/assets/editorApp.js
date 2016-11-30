function getAppManifest () {
}

function addControllerData (applicationId, controllerType, name) {
    return {
        'type': 'Component',
        'skin': 'platform.components.skins.controllerSkin',
        'layout': {
            'width': 40,
            'height': 40,
            'x': 20,
            'y': 15,
            'scale': 1,
            'rotationInDegrees': 0,
            'fixedPosition': false
        },
        'componentType': 'platform.components.AppController',
        'data': {
            'type': 'AppController',
            'applicationId': applicationId,
            'name': name,
            'controllerType': controllerType
        },
        'metaData': {'isPreset': false, 'schemaVersion': '1.0', 'isHidden': false},
        'style': {
            'type': 'TopLevelStyle',
            'metaData': {'isPreset': false, 'schemaVersion': '1.0', 'isHidden': false},
            'style': {
                'groups': {},
                'properties': {
                    'alpha-bg': '1',
                    'alpha-bgh': '1',
                    'alpha-brd': '1',
                    'alpha-brdh': '1',
                    'alpha-txt': '1',
                    'alpha-txth': '1',
                    'bg': '#3D9BE9',
                    'bgh': '#2B689C',
                    'boxShadowToggleOn-shd': 'false',
                    'brd': '#2B689C',
                    'brdh': '#3D9BE9',
                    'brw': '0px',
                    'fnt': 'normal normal normal 14px/1.4em raleway',
                    'rd': '20px',
                    'shd': '0 1px 4px rgba(0, 0, 0, 0.6);',
                    'txt': '#FFFFFF',
                    'txth': '#FFFFFF'
                },
                'propertiesSource': {
                    'bg': 'value',
                    'bgh': 'value',
                    'brd': 'value',
                    'brdh': 'value',
                    'brw': 'value',
                    'fnt': 'value',
                    'rd': 'value',
                    'shd': 'value',
                    'txt': 'value',
                    'txth': 'value'
                }
            },
            'componentClassName': 'platform.components.AppController',
            'skin': 'platform.components.skins.controllerSkin'
        }
    };
}

function galleryCompDef () {
    return {
        "type": "Component",
        "skin": "wysiwyg.common.components.matrixgallery.viewer.skins.MatrixGalleryTextOnCenterSkin",
        "layout": {
            "width": 567,
            "height": 586,
            "x": 206.5,
            "y": 72.828125,
            "scale": 1,
            "rotationInDegrees": 0,
            "fixedPosition": false
        },
        "componentType": "wysiwyg.viewer.components.MatrixGallery",
        "data": {
            "type": "ImageList",
            "metaData": {
                "isPreset": false,
                "schemaVersion": "1.0",
                "isHidden": false
            },
            "items": [
                {
                    "type": "Image",
                    "metaData": {
                        "isPreset": false,
                        "schemaVersion": "2.0",
                        "isHidden": false
                    },
                    "title": "Mountain Lake",
                    "uri": "a9ff3b_61fe61f3eb4c4adeb5835a166de10689.jpg",
                    "description": "Describe your image.",
                    "width": 1920,
                    "height": 1280,
                    "alt": ""
                },
                {
                    "type": "Image",
                    "metaData": {
                        "isPreset": false,
                        "schemaVersion": "2.0",
                        "isHidden": false
                    },
                    "title": "Beach Huts",
                    "uri": "a9ff3b_5f378900670848919283755eb67a5949.jpg",
                    "description": "Describe your image.",
                    "width": 1920,
                    "height": 1922,
                    "alt": ""
                },
                {
                    "type": "Image",
                    "metaData": {
                        "isPreset": false,
                        "schemaVersion": "2.0",
                        "isHidden": false
                    },
                    "title": "Ferris Wheel",
                    "uri": "a9ff3b_7125cf82b18841c2961ce0a241b78826.jpg",
                    "description": "Describe your image.",
                    "width": 1920,
                    "height": 1280,
                    "alt": ""
                },
                {
                    "type": "Image",
                    "metaData": {
                        "isPreset": false,
                        "schemaVersion": "2.0",
                        "isHidden": false
                    },
                    "title": "Palm Trees",
                    "uri": "a9ff3b_1d0b83b8723c4dc39192405fd083142a.jpg",
                    "description": "Describe your image.",
                    "width": 1920,
                    "height": 1280,
                    "alt": ""
                },
                {
                    "type": "Image",
                    "metaData": {
                        "isPreset": false,
                        "schemaVersion": "2.0",
                        "isHidden": false
                    },
                    "title": "City Cycle",
                    "uri": "a9ff3b_f69457ef952c4aa4ba805827a02331c4.jpg",
                    "description": "Describe your image.",
                    "width": 1920,
                    "height": 1280,
                    "alt": ""
                },
                {
                    "type": "Image",
                    "metaData": {
                        "isPreset": false,
                        "schemaVersion": "2.0",
                        "isHidden": false
                    },
                    "title": "Misty Slopes",
                    "uri": "a9ff3b_f2f5a5f6dac648e8a23cd07144c67530.jpg",
                    "description": "Describe your image.",
                    "width": 1920,
                    "height": 1280,
                    "alt": ""
                },
                {
                    "type": "Image",
                    "metaData": {
                        "isPreset": false,
                        "schemaVersion": "2.0",
                        "isHidden": false
                    },
                    "title": "Fire Wood",
                    "uri": "a9ff3b_42da54d3813d45d4b968f5d693c1d29c.jpg",
                    "description": "Describe your image.",
                    "width": 1920,
                    "height": 1920,
                    "alt": ""
                },
                {
                    "type": "Image",
                    "metaData": {
                        "isPreset": false,
                        "schemaVersion": "2.0",
                        "isHidden": false
                    },
                    "title": "Foggy Pier",
                    "uri": "a9ff3b_a2cb5c4ffde14da5a2f47610c4587ad1.jpg",
                    "description": "Describe your image.",
                    "width": 1920,
                    "height": 1920,
                    "alt": ""
                },
                {
                    "type": "Image",
                    "metaData": {
                        "isPreset": false,
                        "schemaVersion": "2.0",
                        "isHidden": false
                    },
                    "title": "Cafe in Autumn",
                    "uri": "a9ff3b_2919fbec56cb4c3086b8159d5aa04b2e.jpg",
                    "description": "Describe your image.",
                    "width": 1920,
                    "height": 1920,
                    "alt": ""
                }
            ]
        },
        "props": {
            "type": "MatrixGalleryProperties",
            "metaData": {
                "schemaVersion": "1.0"
            },
            "expandEnabled": true,
            "galleryImageOnClickAction": "zoomMode",
            "goToLinkText": "Go to link",
            "imageMode": "clipImage",
            "numCols": 3,
            "maxRows": 3,
            "incRows": 2,
            "margin": 15,
            "showMoreLabel": "Show More",
            "alignText": "center"
        }
    }
}

function inputCompDef() {
    return {
        "type": "Component",
        "skin": "wysiwyg.viewer.skins.appinputs.AppsTextInputSkin",
        "layout": {
            "width": 162,
            "height": 40,
            "x": 449,
            "y": 375.828125,
            "scale": 1,
            "rotationInDegrees": 0,
            "fixedPosition": false
        },
        "componentType": "wysiwyg.viewer.components.inputs.TextInput",
        "data": {
            "type": "TextInput",
            "metaData": {
                "isPreset": false,
                "schemaVersion": "1.0",
                "isHidden": false
            }
        },
        "props": {
            "type": "TextInputProperties",
            "metaData": {
                "schemaVersion": "1.0"
            },
            "textAlignment": "center",
            "textPadding": 12,
            "defaultTextType": "none"
        }
    }
};

const controllerDef = addControllerData('id1', 'widgetType', 'controllerName');
const galleryComp = galleryCompDef();
const inputComp = inputCompDef();
function addComp (pageRef, componentDefinition, controllerRef, role) {
    editorSDK.components.add('token', { pageRef, componentDefinition })
        .then((connectToRef) => {
            editorSDK.controllers.connect('token', { connectToRef, controllerRef, role });
    })
}

editorSDK.pages.getCurrent('token').then((currentPage) => {
    editorSDK.components.add('token', { pageRef: currentPage, componentDefinition: controllerDef })
        .then((controllerRef) => {
            addComp(currentPage, galleryComp, controllerRef, 'gallery');
            addComp(currentPage, inputComp, controllerRef, 'input');
        });
    });
function onEvent(event) {
    switch(event.eventType) {
        default:
            debugger;
            break;
    }
}

module.exports = {
    onEvent: onEvent,
    getAppManifest: getAppManifest
};