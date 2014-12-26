var React = require('react');
var Router = require('react-router');
var {State, Navigation} = Router;
var DocumentTitle = require('react-document-title');
var $ = require('jquery');
var MobileDetect = require('mobile-detect');
var isMobile = !!new MobileDetect(navigator.userAgent).mobile();
var moment = require('moment');
moment.locale('en');

var MEMBER_DATA = require('../data').members;
var Lang = require('./Lang');


var WorkItem = React.createClass({

    mixins: [Navigation, Lang],

    _onClick() {
        this.transitionTo(`${this.context.langPrefix}/post/${this.props.slug}/`);
    },

    _onResize() {
        var width = $(window).width();
        var h = ~~(width / 960 * 430);
        var style = {backgroundSize: `${width}px ${h}px`};
        $(this.refs.work.getDOMNode()).css(style);
        $(this.refs.inner.getDOMNode()).css(style).css('padding-top', h - 17);
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
        var style = {backgroundImage: `url(${this.props.featured_image.source})`};
        return (
            <div className="work-item" ref="work" onClick={this._onClick} style={style}>
                <div className="inner" ref="inner" style={style}>
                    <div className="title">{this.props.title}</div>
                    <div className="date">{moment(this.props.date).format('LL')}</div>
                </div>
            </div>
        );
    }
});


module.exports = React.createClass({

    mixins: [State, Navigation, Lang],

    getInitialState() {
        return {member: null, work: [], news: []};
    },

    getDetail() {
        var member = this.getParams().member;
        if (member == this.state.member) return;
        $.getJSON('/wp-json/posts', {'filter[tag]': member, lang: this.context.lang}).done((result) => {
            var state = {member: member, work: [], news: []};
            result.map((entry) => {
                if (state[entry.terms.category[0].slug]) {
                    state[entry.terms.category[0].slug].push(entry);
                }
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
        this.transitionTo(`${this.context.langPrefix}/post/${path}/`);
    },

    render() {
        var title = 'dot by dot inc.';
        if (this.state.member) {
            if (this.context.lang == 'en' && MEMBER_DATA[this.state.member].name_en) {
                title = MEMBER_DATA[this.state.member].name_en + ' ● dot by dot inc.';
            } else {
                title = MEMBER_DATA[this.state.member].name_ja + ' ● dot by dot inc.';
            }
        }
        var work = this.state.work.map(work => <WorkItem key={work.guid} {...work}/>);
        var news = this.state.news.map((news) => {
            var date = moment(news.date).format('LL');
            if (isMobile) {
                return (
                    <tr key={news.guid} onClick={this._onClickItem.bind(this, news.slug)}>
                        <td dangerouslySetInnerHTML={{__html: news.title}}/>
                        <th>{date}</th>
                    </tr>
                );
            } else {
                return (
                    <tr key={news.guid} onClick={this._onClickItem.bind(this, news.slug)}>
                        <th>{date}</th>
                        <td dangerouslySetInnerHTML={{__html: news.title}}/>
                    </tr>
                );
            }
        });
        return (
            <DocumentTitle title={title}>
                <div className="member-detail">
                    {work.length ? (
                        <div>
                            <h2>WORK</h2>
                            <hr className = "line" />
                            <div className="works-list clearfix">{work}</div>
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
            </DocumentTitle>
        );
    }
});
