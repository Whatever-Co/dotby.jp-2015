var React = require('react');
var Router = require('react-router');
var {State} = Router;
var $ = require('jquery');

var NotFound = require('./NotFound');


module.exports = React.createClass({
    mixins: [State],
    getInitialState() {
        return {entry: null};
    },
    getEntry() {
        var params = this.getParams();
        $.getJSON(`/wp-json/pages/${params.page}`).done((result) => {
            this.setState({entry: result});
        });
    },
    componentDidMount() {
        this.getEntry();
    },
    componentWillReceiveProps() {
        this.getEntries();
    },
    render() {
        if (!this.state.entry) return <NotFound/>;
        var entry = this.state.entry;
        return (
            <div>
                <div key={entry.guid}>
                    <hr className="line"/>
                    <div className="entry">
                        <div className="inner" ref="inner">
                            <div className="body" ref="body" dangerouslySetInnerHTML={{__html: entry.content}}></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
