var React = require('react');
var Router = require('react-router');
var {Link, RouteHandler, Navigation, State} = Router;
var $ = require('jquery');
var assign = require('object-assign');


var MEMBER_DATA = {
    yusuke: {
        job_title: 'Planner / CEO',
        name_en: 'Yusuke Tominaga'
    },
    saqoosha: {
        job_title: 'Programmer / CTO',
        name_en: ''
    },
    heri: {
        job_title: 'Creative Director / CCO',
        name_en: 'Kyosuke Taniguchi'
    },
    sfman: {
        job_title: 'Planner',
        name_en: 'Shinnya Fujiwara'
    },
    seki: {
        job_title: 'Producer',
        name_en: 'Kenichi Seki'
    }
};


var Member = React.createClass({
    mixins: [Navigation],
    _onClick() {
        this.transitionTo('/members/' + this.props.member.slug);
    },
    render() {
        var member = this.props.member;
        return (
            <div className="member" onClick={this._onClick}>
                <div className="inner">
                    <div className="name-title">
                        <div>
                            <span className="title">● {member.job_title}</span>
                            <span className="name-ja">{member.title}</span>
                            {member.name_en ? <span className="name-en">{member.name_en}</span> : ''}
                        </div>
                    </div>
                </div>
                <div className="portrait" style={{backgroundImage: `url(${member.featured_image.source})`}}>
                    <div className="border"/>
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
    componentDidMount() {
        var members = ['yusuke', 'saqoosha', 'heri', 'sfman', 'seki'].map((name) => {
            return $.getJSON(`/wp-json/pages/members/${name}`);
        });
        $.when.apply(null, members).done(()=> {
            var result = Array.prototype.map.call(arguments, (result) => result[0]);
            this.setState({members: result});
        });
    },
    componentWillReceiveProps() {
        console.log('componentWillReceiveProps', this.getPathname(), this.getParams());
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
