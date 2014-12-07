var React = require('react');
var Router = require('react-router');
var {RouteHandler} = Router;

var Dots = require('./Dots');
var Header = require('./Header');

module.exports = React.createClass({
    render() {
        return (
            <div>
                <Dots/>
                <div id="container" className="clearfix">
                    <Header/>
                    <RouteHandler {...this.props}/>
                </div>
            </div>
        );
    }
});
