var React = require('react');
var NotFound = require('./NotFound');

module.exports = React.createClass({
    getDefaultProps() {
        return {data: {}};
    },
    render() {
        if (this.props.data.length) return <NotFound/>;
        var entry = this.props.data;
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
