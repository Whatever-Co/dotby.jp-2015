var React = require('react');
var Router = require('react-router');
var {State, Link} = Router;
var $ = require('jquery');
var moment = require('moment');
moment.lang('en');


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
            return (
                <div className="work-item" key={work.guid}>
                    <div className="image" style={{backgroundImage: `url(${work.featured_image.source})`}}>
                        <div className="border"/>
                    </div>
                    <div className="inner">
                        <div className="title">{work.title}</div>
                        <div className="date">{moment(work.date).format('LL')}</div>
                    </div>
                </div>
            );
        });
        var news = this.state.news.map((news) => {
            return (
                <tr key={news.guid}>
                    <th>{moment(news.date).format('LL')}</th>
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
