var React = require('react');
var Router = require('react-router');
var {RouteHandler} = Router;
var DocumentTitle = require('react-document-title');

var Dots = require('./Dots/Main');
var Header = require('./Header');
var Menu = require('./Menu');
var Footer = require('./Footer');


module.exports = React.createClass({
    componentDidMount() {
        this.dots = new Dots(this.refs.dots.getDOMNode())
    },
    render() {
        return (
            <DocumentTitle title="dot by dot inc.">
                <div>
                    <div id="dots" ref="dots"/>
                    <div id="container" className="clearfix">
                        <Header/>
                        <RouteHandler {...this.props}/>
                    </div>
                    <Menu/>
                    <Footer/>
                </div>
            </DocumentTitle>
        );
    }
});
