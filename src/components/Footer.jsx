var React = require('react');
var $ = require('jquery');
var _ = require('underscore');


module.exports = React.createClass({
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
            left: window.screenLeft + (window.outerWidth  - width)  / 2,
            top: window.screenTop + (window.outerHeight - height) / 2
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
                    <button className="facebook" onClick={this._onClickFB}/>
                    <button className="twitter" onClick={this._onClickTW}/>
                    <button className="top" onClick={this._onClickTop}/>
                </div>
            </div>
        );
    }
});
