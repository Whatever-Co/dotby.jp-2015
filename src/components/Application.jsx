var React = require('react');
var Router = require('react-router');
var {RouteHandler} = Router;

var Dots = require('./Dots/Main');
var Header = require('./Header');
var Footer = require('./Footer');

module.exports = React.createClass({
    componentDidMount() {
        this.dots = new Dots(this.refs.dots.getDOMNode())
    },
    render() {
        return (
            <div>
                <div id="dots" ref="dots"/>
                <div id="container" className="clearfix">
                    <Header/>
                    <RouteHandler {...this.props}/>
                </div>
                <Footer/>
            </div>
        );
    }
});
