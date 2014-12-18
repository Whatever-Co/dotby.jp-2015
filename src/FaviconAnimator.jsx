var $ = require('jquery');
var DotEvents = require('./components/Dots/Events');


class FaviconAnimator {
    constructor() {
        this.metaIcon = $('link[rel="shortcut icon"]')[0];
        this.canvas = document.createElement('canvas');
        this.canvas.width = 32;
        this.canvas.height = 32;
        this.context = this.canvas.getContext('2d');
        DotEvents.addListener('colorChanged', this._onColor.bind(this));
    }
    _onColor(color) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = color;
        this.context.beginPath();
        var r = this.canvas.width / 2;
        this.context.arc(r, r, r * 0.75, 0, Math.PI * 2, false);
        this.context.closePath();
        this.context.fill();
        this.metaIcon.href = this.canvas.toDataURL();
    }
}

module.exports = FaviconAnimator;
