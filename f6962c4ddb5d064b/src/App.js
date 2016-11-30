'use strict';
import FlipCard from './components/FlipCard/FlipCard';
import React from 'react';
import * as editorSDK from 'platform-editor-sdk';
import styleMap from './styleMap';
import cx from 'classnames';

class App extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            isFlipped: []
        }
    }
    handleOnFlip(flipped) {
        if (flipped) {
            this.refs.backButton.focus();
        }
    }

    handleKeyDown(e) {
        if (this.state.isFlipped.length > 0 && e.keyCode === 27) {
            this.showFront();
        }
    }

    showFront(id) {
        var index = this.state.isFlipped.indexOf(id);
        if (index > -1) {
            this.state.isFlipped.splice(index, 1);
        }
        this.setState(this.state.isFlipped);
    }

    showBack(id) {
        this.state.isFlipped.push(id);;
        this.setState(this.state.isFlipped);
    }

    addApp(id, editorUrl, viewerUrl) {
        editorSDK.__internal__.addApp('fobar', {
            id, editorUrl, viewerUrl
        });

        editorSDK.editor.closePanel('editor-platform-app-configuration-ui-node');
    }
    render() {
        const items = JSON.parse(this.props.itemsAsString);
        return (<div style={styleMap.inline.app}>
            {items.map((app, index) => {
                return (
                    <FlipCard
                        key={index}
                        ref={app.id}
                        disabled={true}
                        flipped={this.state.isFlipped.indexOf(app.id) > -1}
                        onFlip={this.handleOnFlip.bind(this, app.id)}
                        onKeyDown={this.handleKeyDown.bind(this, app.id)}
                        bgImage={app.poster || 'http://static.wixstatic.com/media/1916386a58894cab9ae2c35f39c816fb.jpg'}
                    >
                        <div>
                            <div>{app.name}</div>
                            <button style={styleMap.inline.button} type="button" onClick={this.showBack.bind(this, app.id)}>
                                <span className={cx("glyphicon","glyphicon-repeat")}></span>
                            </button>
                        </div>
                        <div>
                            <div>{app.name} Back</div>
                            <button style={styleMap.inline.button} type="button" ref="backButton" onClick={this.showFront.bind(this, app.id)}><span className={cx("glyphicon","glyphicon-repeat")}></span></button>
                            <button style={{marginTop: '10px'}} className={cx("btn", "btn-primary", "btn-sm")} type="button" ref="addApp" onClick={this.addApp.bind(this, app.id, app.editorUrl, app.viewerUrl)}>Add app</button>
                        </div>
                    </FlipCard>
                );
            })}
        </div>);
    }
}

module.exports = App;