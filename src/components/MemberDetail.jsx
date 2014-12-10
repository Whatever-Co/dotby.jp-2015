var React = require('react');
var Router = require('react-router');
var {State, Link} = Router;
var $ = require('jquery');


var MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


module.exports = React.createClass({
    mixins: [State],
    getInitialState() {
        return {works: [], news: []};
    },
    getDetail() {
        $.getJSON('/wp-json/posts', {'filter[tag]': this.getParams().member}).done((result) => {
            var state = {works: [], news: []};
            result.map((entry) => {
                state[entry.terms.category[0].slug].push(entry);
            });
            this.setState(state);
        });
    },
    componentDidMount() {
        this.getDetail();
    },
    componentWillReceiveProps() {
        this.getDetail();
    },
    render() {
        var works = this.state.works.map((work) => {
            var date = new Date(work.date_gmt);
            return (
                <div className="work-item" key={work.guid}>
                    <div className="image" style={{backgroundImage: `url(${work.featured_image.source})`}}>
                        <div className="border"/>
                    </div>
                    <div className="inner">
                        <div className="title">{work.title}</div>
                        <div className="date">{`${MONTH_NAMES[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`}</div>
                    </div>
                </div>
            );
        });
        var news = this.state.news.map((news) => {
            var date = new Date(news.date_gmt);
            return (
                <tr key={news.guid}>
                    <th>{`${MONTH_NAMES[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`}</th>
                    <td>{news.title}</td>
                </tr>
            );
        });
        return (
            <div className="member-detail">
                {works.length ? (
                    <div>
                        <h2>WORKS</h2>
                        <hr className = "line" />
                        <div className="works-list clearfix">{works}</div>
                    </div>
                ) : ''}
                {news.length ? (
                    <div>
                        <h2>NEWS</h2>
                        <hr className="line"/>
                        <table className="news-list"><tbody>{news}</tbody></table>
                    </div>
                ) : ''}
            </div>
        );
    }
});
