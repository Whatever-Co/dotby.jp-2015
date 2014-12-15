var React = require('react/addons');
var cx = React.addons.classSet;
var Router = require('react-router');
var {Link, RouteHandler, Navigation, State} = Router;
var $ = require('jquery');
var _ = require('underscore');
var assign = require('object-assign');
var MobileDetect = require('mobile-detect');
var isMobile = !!new MobileDetect(navigator.userAgent).mobile();

var MEMBER_DATA = require('../data').members;


var Member = React.createClass({
    mixins: [Navigation, State],
    _onClick() {
        this.transitionTo(`/members/${this.props.member.slug}/`);
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
    },
    componentWillUnmount() {
        $(window).off('resize', this._onResize);
    },
    render() {
        var member = this.props.member;
        var content = $(member.content);
        return (
            <div className={'member ' + member.mode} onClick={member.mode == 'list' ? this._onClick : null}>
                <hr className="line"/>
                <div ref="portrait" style={{backgroundImage: `url(${member.featured_image.source})`}}>
                    <div className="inner" ref="inner" style={{backgroundImage: `url(${member.featured_image.source})`}}>
                        <div className="name-title">
                            <div>
                                <span className="title"><span style={{color: member.color}}>●</span> {member.job_title}</span>
                                <span className="name-ja">{member.title}</span>
                                {member.name_en ? <span className="name-en">{member.name_en}</span> : ''}
                            </div>
                        </div>
                        <div className="more">
                            <hr className="line"/>
                            <div className="body" dangerouslySetInnerHTML={{__html: content.filter('.body').html()}}></div>
                            <ul className="links" dangerouslySetInnerHTML={{__html: content.filter('.links').html()}}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});


module.exports = React.createClass({
    mixins: [State],
    getInitialState() {
        return {members: []};
    },
    _setFlags(state) {
        var current= this.getParams().member;
        state.members.map((member) => {
            member.isListMode = !current;
            member.isFocusing = member.slug == current;
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
            return $.getJSON(`/wp-json/pages/members/${name}`);
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
            <div className="member-list">
                {this.state.members.map(member => <Member key={member.guid} member={assign(member, MEMBER_DATA[member.slug])}/>)}
                <RouteHandler/>
            </div>
        );
    }
});
