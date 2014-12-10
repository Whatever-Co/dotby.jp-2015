var React = require('react/addons');
var cx = React.addons.classSet;
var Router = require('react-router');
var {Link, RouteHandler, Navigation, State} = Router;
var $ = require('jquery');
var _ = require('underscore');
var assign = require('object-assign');

var MEMBER_DATA = require('../data');


var Member = React.createClass({
    mixins: [Navigation, State],
    _onClick() {
        this.transitionTo(`/members/${this.props.member.slug}/`);
    },
    render() {
        var member = this.props.member;
        var content = $(member.content);
        return (
            <div className={cx({member: true, list: member.isListMode | member.isFocusing})} onClick={!member.isFocusing ? this._onClick : null}>
                <div className="inner">
                    <div className="name-title">
                        <div>
                            <span className="title">● {member.job_title}</span>
                            <span className="name-ja">{member.title}</span>
                            {member.name_en ? <span className="name-en">{member.name_en}</span> : ''}
                        </div>
                    </div>
                    <div className={cx({more: true, detailed: member.isFocusing})}>
                        <hr className="line"/>
                        <div className="body" dangerouslySetInnerHTML={{__html: content.filter('.body').html()}}></div>
                        <ul className="links" dangerouslySetInnerHTML={{__html: content.filter('.links').html()}}/>
                    </div>
                </div>
                <div className="portrait" style={{backgroundImage: `url(${member.featured_image.source})`}}>
                    <div className={cx({border: true, focusing: member.isFocusing})}/>
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
            <div>
                <hr className="line"/>
                {this.state.members.map((member) => <Member key={member.guid} member={assign(member, MEMBER_DATA[member.slug])}/>)}
                <RouteHandler/>
            </div>
        );
    }
});
