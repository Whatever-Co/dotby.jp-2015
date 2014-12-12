var React = require('react/addons');
var cx = React.addons.classSet;
var Router = require('react-router');
var {Link, State} = Router;
var $ = require('jquery');
var _ = require('underscore');

var DotEvents = require('./Dots/Events');
var MenuData = require('../data').menu;


module.exports = React.createClass({
    mixins: [State],
    getInitialState() {
        return {items: MenuData.map((item) => {
            var copy = _.clone(item);
            copy.active = false;
            return copy;
        })};
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
    componentDidMount() {
        this._setActive();
        this.dots = $('.dot', this.getDOMNode());
        DotEvents.addListener('colorChanged', this._onChangeColor);
    },
    componentWillUnmount() {
        DotEvents.removeListener('colorChanged', this._onChangeColor);
    },
    componentWillReceiveProps() {
        this._setActive();
    },
    render() {
        return (
            <div id="header">
                <div id="logo">
                    <Link to="/"><img src="/assets/logo.png" width="190" height="34"/></Link>
                </div>
                <ul id="menu">
                {this.state.items.map((item) => {
                    return (
                        <li key={item.path}>
                            <span className={cx({dot: true, inactive: !item.active})}>●</span>
                            <Link to={item.path}>{item.name}</Link>
                        </li>
                    );
                })}
                </ul>
            </div>
        );
    }
});
