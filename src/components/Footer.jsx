var React = require('react');
var $ = require('jquery');
var _ = require('underscore');
var MobileDetect = require('mobile-detect');
var isMobile = !!new MobileDetect(navigator.userAgent).mobile();

var DotEvents = require('./Dots/Events');


module.exports = React.createClass({

    _onClickWP() {
        DotEvents.emit('saveAsPNG');
    },

    _onClickFB() {
        FB.ui({
            method: 'share',
            href: location.href
        });
    },

    _onClickTW() {
        var url = 'https://twitter.com/share?url=' + encodeURIComponent(location.href);
        var width = 550;
        var height = 300;
        var opts = {
            width: width,
            height: height,
            left: (window.screenLeft || window.screenX) + (window.outerWidth  - width)  / 2,
            top: (window.screenTop || window.screenY)+ (window.outerHeight - height) / 2
        };
        opts = _.keys(opts).map(key => key + '=' + opts[key]).join(',');
        window.open(url, 'twitter', opts);
    },

    _onClickTop() {
        $('html, body').animate({scrollTop: 0}, 'fast');
    },

    render() {
        return (
            <div id="footer">
                <img className="copyright" src="/assets/copyright.png"/>
                <div className="buttons">
                    {isMobile ? '' : <button className="wallpaper" onClick={this._onClickWP}/>}
                    <button className="facebook" onClick={this._onClickFB}/>
                    <button className="twitter" onClick={this._onClickTW}/>
                    {!isMobile ? '' : <button className="wallpaper" onClick={this._onClickWP}/>}
                    <button className="top" onClick={this._onClickTop}/>
                </div>
            </div>
        );
    }

});
