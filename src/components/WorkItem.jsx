var React = require('react');
var Router = require('react-router');
var {State, Navigation} = Router;
var $ = require('jquery');
var MobileDetect = require('mobile-detect');
var isMobile = !!new MobileDetect(navigator.userAgent).mobile();
var moment = require('moment');
moment.locale('en');

var Lang = require('./Lang');


module.exports = React.createClass({

    mixins: [Navigation, Lang],

    _onClick() {
        this.transitionTo(`${this.context.langPrefix}/post/${this.props.slug}/`);
    },

    _onResize() {
        var width = $(window).width();
        var h = ~~(width / 960 * 430);
        var style = {backgroundSize: `${width}px ${h}px`};
        $(this.refs.work.getDOMNode()).css(style);
        $(this.refs.inner.getDOMNode()).css(style).css('padding-top', h - 17);
    },

    componentDidMount() {
        if (isMobile) {
            $(window).on('resize', this._onResize);
            this._onResize();
        }
    },

    componentWillUnmount() {
        $(window).off('resize', this._onResize);
    },

    render() {
        var style = {backgroundImage: `url(${this.props.featured_image.source})`, display: this.props.match ? 'block' : 'none'};
        return (
            <div className="work-item" ref="work" onClick={this._onClick} style={style}>
                <div className="inner" ref="inner" style={style}>
                    <div className="title" dangerouslySetInnerHTML={{__html: this.props.title}}/>
                    <div className="date">{moment(this.props.date).format('LL')}</div>
                </div>
            </div>
        );
    }
});
