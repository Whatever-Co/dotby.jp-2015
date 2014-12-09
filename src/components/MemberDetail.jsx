var React = require('react');
var Router = require('react-router');
var {State} = Router;
var $ = require('jquery');


module.exports = React.createClass({
    mixins: [State],
    getInitialState() {
        return {data: null};
    },
    getDetail() {

    },
    componentDidMount() {
        console.log('componentDidMount', this.getParams());
    },
    componentWillReceiveProps() {
        console.log('componentWillReceiveProps', this.getParams());
    },
    render() {
        return (
            <div>Hoge</div>
        );
    }
});
