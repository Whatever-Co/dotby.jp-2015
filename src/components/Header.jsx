var React = require('react/addons');
var cx = React.addons.classSet;
var Router = require('react-router');
var {Link, State} = Router;
var $ = require('jquery');

var DotEvents = require('./Dots/Events');


module.exports = React.createClass({
    mixins: [State],
    getInitialState() {
        return {items: [
            {name: 'ABOUT', path: '/about/', active: false},
            {name: 'MEMBERS', path: '/members/', active: false},
            {name: 'WORKS', path: '/category/works/', active: false},
            {name: 'NEWS', path: '/category/news/', active: false}
        ]};
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
                    <Link to="/"><img src="/assets/logo.svg" width="190"/></Link>
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
