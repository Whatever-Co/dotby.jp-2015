var React = require('react');
var Router = require('react-router');
var {State, Navigation} = Router;
var DocumentTitle = require('react-document-title');
var $ = require('jquery');
var MobileDetect = require('mobile-detect');
var isMobile = !!new MobileDetect(navigator.userAgent).mobile();
var moment = require('moment');
moment.locale('en');

var WorkItem = require('./WorkItem')
var MEMBER_DATA = require('../data').members;
var Lang = require('./Lang');
var NotFound = require('./NotFound');


module.exports = React.createClass({

    mixins: [State, Navigation, Lang],

    getInitialState() {
        return {member: null, work: [], news: []};
    },

    getDetail() {
        var member = this.getParams().member;
        if (member == this.state.member || !this._memberExists()) return;
        $.getJSON('/wp-json/posts', {'filter[tag]': member,  'filter[posts_per_page]': 200, lang: this.context.lang, _wp_json_nonce: window.nonce}).done((result) => {
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

    _memberExists() {
        return (this.state.member in MEMBER_DATA) && (MEMBER_DATA[this.state.member].hidden !== true)
    },

    render() {
        if (!this._memberExists()) return <NotFound/>;

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
