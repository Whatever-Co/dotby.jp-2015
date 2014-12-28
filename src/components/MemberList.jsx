var React = require('react/addons');
var cx = React.addons.classSet;
var Router = require('react-router');
var {RouteHandler, Navigation, State} = Router;
var DocumentTitle = require('react-document-title');
var $ = require('jquery');
var _ = require('underscore');
var assign = require('object-assign');
var MobileDetect = require('mobile-detect');
var isMobile = !!new MobileDetect(navigator.userAgent).mobile();

var MEMBER_DATA = require('../data').members;
var Lang = require('./Lang');


var Member = React.createClass({

    mixins: [Navigation, State, Lang],

    _onClick() {
        this.transitionTo(`${this.context.langPrefix}/members/${this.props.member.slug}/`);
    },

    _onClickLink(e) {
        e.preventDefault();
        var href = $(e.currentTarget).attr('href');
        if (href.match(/^\w+:/i)) {
            window.open(href);
        } else {
            this.transitionTo(this.context.langPrefix + href);
        }
    },

    _onResize() {
        var w = window.innerWidth;
        var h = w / 4 * 3;
        $(this.refs.portrait.getDOMNode()).css('background-size', `${w}px ${h}px`);
        $(this.refs.inner.getDOMNode()).css({
            'padding-top': h + 10,
            'background-size': `${w}px ${h}px`
        });
    },

    componentDidMount() {
        if (isMobile) {
            $(window).on('resize', this._onResize);
            this._onResize();
        }
        $('a', this.refs.body.getDOMNode()).on('click', this._onClickLink);
    },

    componentWillUnmount() {
        $(window).off('resize', this._onResize);
        $('a', this.refs.body.getDOMNode()).off('click', this._onClickLink);
    },

    render() {
        var member = this.props.member;
        if (member.meta.rel_links) {
            var links = member.meta.rel_links.split(/\n/).map((link) => {
                var info = link.split(',');
                var name = info[0].trim();
                var href = info[1].trim();
                return <li key={href}><a href={href} target="_blank">{name}</a></li>;
            });
        }
        return (
            <div className={'member ' + member.mode} onClick={member.mode == 'list' ? this._onClick : null}>
                <hr className="line"/>
                <div ref="portrait" style={{backgroundImage: `url(${member.featured_image.source})`}}>
                    <div className="inner" ref="inner" style={{backgroundImage: `url(${member.featured_image.source})`}}>
                        <div className="name-title">
                            <div>
                                <span className="title"><span style={{color: member.color}}>●</span> {member.meta.title}</span>
                                <span className="name-ja">{member.name_ja}</span>
                                {member.name_en ? <span className="name-en">{member.name_en}</span> : ''}
                            </div>
                        </div>
                        <div className="more">
                            <hr className="line"/>
                            <div ref="body" className="body" dangerouslySetInnerHTML={{__html: member.content}}></div>
                            {links ? (<ul className="links">{links}</ul>) : ''}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});


module.exports = React.createClass({

    mixins: [State, Lang],

    getInitialState() {
        return {members: []};
    },

    _setFlags(state) {
        var current= this.getParams().member;
        state.members.map((member) => {
            if (current) {
                member.mode = member.slug == current ? 'open' : 'close';
            } else {
                member.mode = 'list';
            }
        });
        return state;
    },

    componentDidMount() {
        var members = _.keys(MEMBER_DATA).map((name) => {
            return $.getJSON(`/wp-json/pages/members/${name}`, {lang: this.context.lang});
        });
        $.when.apply(null, members).done(()=> {
            var result = Array.prototype.map.call(arguments, (result) => result[0]);
            this.setState(this._setFlags({members: result}));
        });
    },

    componentWillReceiveProps() {
        this.setState(this._setFlags(this.state));
    },

    render() {
        return (
            <DocumentTitle title="MEMBERS ● dot by dot inc.">
                <div className="member-list">
                    {this.state.members.map(member => <Member key={member.guid} member={assign(member, MEMBER_DATA[member.slug])}/>)}
                    <RouteHandler/>
                </div>
            </DocumentTitle>
        );
    }
});
