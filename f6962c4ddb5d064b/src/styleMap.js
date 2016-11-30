module.exports = {
    inline: {
        flipCard: {
            display: "inline-block",
            boxSizing: "border-box",
            margin: "40px"
        },
        app: {
            overflow: 'auto',
            height: '372px'
        },
        button: {
            position: "fixed",
            bottom: 0,
            right: 0,
            border: "none",
            borderRadius: "0px 0px 10px 0px",
            backgroundColor: "transparent"
        }
    },
    classes: {
        flipCard: function() {
            return {
                'ReactFlipCard': true,
                'ReactFlipCard--vertical': this.props.type === 'vertical',
                'ReactFlipCard--horizontal': this.props.type !== 'vertical',
                'ReactFlipCard--flipped': this.state.isFlipped,
                'ReactFlipCard--enabled': !this.props.disabled
            }
        }
    },
    bgImage: function (bgImage) {
        return {
            backgroundImage: `url(${bgImage})`
        }
    }
};