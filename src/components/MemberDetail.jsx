var React = require('react');
var Router = require('react-router');
var {State, Navigation, Link} = Router;
var $ = require('jquery');
var MobileDetect = require('mobile-detect');
var isMobile = !!new MobileDetect(navigator.userAgent).mobile();
var moment = require('moment');
moment.locale('en');


var WorkItem = React.createClass({
    mixins: [Navigation],
    _onClick() {
        this.transitionTo(`/post/${this.props.slug}/`);
    },
    _onResize() {
        var width = $(window).width();
        var h = width / 960 * 430;
        $(this.refs.image.getDOMNode()).width(width).height(h);
        $(this.refs.inner.getDOMNode()).css('padding-top', h + 10);
    },
    componentDidMount() {
        if (isMobile) {
            $(window).on('resize', this._onResize);
            this._onResize();
        }
    },
    componentWillUnmount() {
        $(window).off('resize', this._onResize);
    },
    render() {
        return (
            <div className="work-item" onClick={this._onClick}>
                <div className="image" ref="image" style={{backgroundImage: `url(${this.props.featured_image.source})`}}>
                    <div className="border"/>
                </div>
                <div className="inner" ref="inner">
                    <div className="title">{this.props.title}</div>
                    <div className="date">{moment(this.props.date).format('LL')}</div>
                </div>
            </div>
        );
    }
});


module.exports = React.createClass({
    mixins: [State, Navigation],
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
    _onClickItem(path) {
        this.transitionTo(`/post/${path}/`);
    },
    render() {
        var works = this.state.works.map(work => <WorkItem key={work.guid} {...work}/>);
        var news = this.state.news.map((news) => {
            var date = moment(news.date).format('LL');
            if (isMobile) {
                return (
                    <tr key={news.guid} onClick={this._onClickItem.bind(this, news.slug)}>
                        <td>{news.title}</td>
                        <th>{date}</th>
                    </tr>
                );
            } else {
                return (
                    <tr key={news.guid} onClick={this._onClickItem.bind(this, news.slug)}>
                        <th>{date}</th>
                        <td>{news.title}</td>
                    </tr>
                );
            }
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
