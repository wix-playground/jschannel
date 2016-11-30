function getAppManifest () {
}

editorSDK.editor.openModalPanel(
    'editor-platform-app-configuration-ui-node', {
        panelType: 'modalPanel',
        width: '800',
        height: '400',
        url: 'http://apps.wix.com/editor-platform-app-configuration-ui-node/'
    });

function onEvent(event) {
    switch(event.eventType) {
        default:
            break;
    }
}

module.exports = {
    onEvent: onEvent,
    getAppManifest: getAppManifest
};