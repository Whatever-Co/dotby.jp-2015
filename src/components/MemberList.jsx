var React = require('react');
var Router = require('react-router');
var {Link} = Router;
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
    _onClick() {
        console.log(this);
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
                            { member.name_en ? <span className="name-en">{member.name_en}</span> : ''}
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
    render() {
        return (
            <div>
                <hr className="line"/>
                {this.props.data.map((member) => <Member key={member.guid} member={assign(member, MEMBER_DATA[member.slug])}/>)}
            </div>
        );
    }
});
