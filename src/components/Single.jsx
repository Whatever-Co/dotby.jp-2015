var React = require('react');
var Router = require('react-router');
var {State} = Router;
var $ = require('jquery');

var Entry = require('./Entry');
var NotFound = require('./NotFound');
var Lang = require('./Lang');


module.exports = React.createClass({

    mixins: [State, Lang],

    getInitialState() {
        return {entry: null}
    },

    getEntry() {
        $.getJSON('/wp-json/posts', {'filter[name]': this.getParams().post, lang: this.context.lang}).done((result) => {
            this.setState({entry: result[0]});
        });
    },

    componentDidMount() {
        this.getEntry();
    },

    componentWillReceiveProps() {
        this.getEntry();
    },

    render() {
        return (
            <div>
                <hr className="line"/>
                {this.state.entry ? <Entry entry={this.state.entry} single={true}/> : <NotFound/>}
            </div>
        );
    }
});
