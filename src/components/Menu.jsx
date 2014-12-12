var React = require('react/addons');
var cx = React.addons.classSet;
var Router = require('react-router');
var {Link, State} = Router;
var $ = require('jquery');
var _ = require('underscore');
require('browsernizr/test/touchevents');
var Modernizr= require('browsernizr');

var DotEvents = require('./Dots/Events');
var MenuData = require('../data').menu;


var MenuButton = React.createClass({
    getDefaultProps() {
        return {isEnable: false, isOpen: false}
    },
    render() {
        return (
            <div id="menu-button" className={cx({enable: this.props.isEnable, close: this.props.isOpen})} onClick={Modernizr.touchevents ? null : this.props.onClick} onTouchStart={Modernizr.touchevents ? this.props.onClick : null}>
                <div className="upper-left"/>
                <div className="upper-right"/>
                <div className="middle"/>
                <div className="lower-left"/>
                <div className="lower-right"/>
            </div>
        );
    }
});


module.exports = React.createClass({
    mixins: [State],
    getInitialState() {
        return {
            isEnable: false,
            isOpen: false,
            items: MenuData.map((item) => {
                var copy = _.clone(item);
                copy.active = false;
                return copy;
            })
        };
    },
    _toggleMenu() {
        this.setState({isOpen: !this.state.isOpen});
    },
    _setActive() {
        var current = this.getPathname();
        var items = this.state.items.map((item) => {
            item.active = current.indexOf(item.path) == 0;
            return item;
        });
        this.setState({items: items});
    },
    _onChangeColor(color) {
        this.dots.css({color: color});
    },
    _onScroll() {
        var state = {isEnable: $(window).scrollTop() > 170};
        if (!state.isEnable) state.isOpen = false;
        this.setState(state);
    },
    _onClick(e) {
        if (!$.contains(this.getDOMNode(), e.target)) {
            this.setState({isOpen: false});
        }
    },
    componentDidMount() {
        this._setActive();
        this.dots = $('.dot', this.getDOMNode());
        DotEvents.addListener('colorChanged', this._onChangeColor);
        $(window).on('scroll', this._onScroll).on('click', this._onClick);
    },
    componentWillUnmount() {
        DotEvents.removeListener('colorChanged', this._onChangeColor);
        $(window).off('scroll', this._onScroll)
    },
    componentWillReceiveProps() {
        this._setActive();
        this.setState({isOpen: false});
    },
    render() {
        return (
            <div id="floating-menu">
                <ul className={cx({close: !this.state.isOpen})}>
                {this.state.items.map((item) => {
                    return (
                        <li key={item.path}>
                            <span className={cx({dot: true, inactive: !item.active})}>●</span>
                            <Link to={item.path}>{item.name}</Link>
                        </li>
                    );
                })}
                </ul>
                <MenuButton isEnable={this.state.isEnable} isOpen={this.state.isOpen} onClick={this._toggleMenu}/>
            </div>
        );
    }
});
