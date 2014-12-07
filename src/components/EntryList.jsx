var React = require('react');
var Entry = require('./Entry');

module.exports = React.createClass({
    getDefaultProps() {
        return {data: []};
    },
    render() {
        return (
            <div>
                {this.props.data.map((entry) => {
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
