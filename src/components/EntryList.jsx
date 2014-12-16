var React = require('react');
var Route = require('react-router');
var {State} = Route;
var $ = require('jquery');

var Entry = require('./Entry');
var Lang = require('./Lang');


module.exports = React.createClass({

    mixins: [State, Lang],

    getInitialState() {
        return {entries: []}
    },

    getEntries() {
        var params = this.getParams();
        var data = {lang: this.context.lang};
        if (params.category) {
            data['filter[category_name]'] = params.category;
        }
        $.getJSON('/wp-json/posts', data).done((result) => {
            this.setState({entries: result});
        });
    },

    componentDidMount() {
        this.getEntries();
    },

    componentWillReceiveProps() {
        this.getEntries();
    },

    render() {
        return (
            <div>
                {this.state.entries.map((entry) => {
                    return (
                        <div key={entry.guid}>
                            <hr className="line"/>
                            <Entry entry={entry} />
                        </div>
                    );
                })}
            </div>
        );
    }
});
