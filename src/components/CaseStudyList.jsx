var React = require('react/addons');
var cx = React.addons.classSet;
var Router = require('react-router');
var {RouteHandler, Navigation, State} = Router;
var DocumentTitle = require('react-document-title');
var $ = require('jquery');
var _ = require('underscore');
var MobileDetect = require('mobile-detect');
var isMobile = !!new MobileDetect(navigator.userAgent).mobile();

var Lang = require('./Lang');


var Item = React.createClass({

    mixins: [Navigation, State, Lang],

    _onClick() {
        this.transitionTo(`${this.context.langPrefix}/case-study/${this.props.item.slug}/`);
    },

    _onResize() {
        var w = window.innerWidth;
        var h = w;
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
        var item = this.props.item;
        return (
            <div className={'case-study-list'} onClick={this._onClick}>
                <div ref="portrait" style={{backgroundImage: `url(${item.featured_image})`}}>
                    <div className="inner" ref="inner" style={{backgroundImage: `url(${item.featured_image})`}}>
                        <div className="date-title">
                            <div>
                                <span className="date">{item.date}</span>
                                <span className="title" dangerouslySetInnerHTML={{__html: item.title.replace(/Case study #\d+/i, '$&<br/>')}}></span>
                            </div>
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
        return {items: [
            {
                guid: 'http://dotby.jp/?page_id=760',
                slug: '01-muji-10000-shapes-of-tokyo',
                date: 'Aug 30, 2016',
                title: 'Case study #01「MUJI 10,000 shapes of TOKYO」',
                featured_image: 'http://dotby.jp/wordpress/wp-content/uploads/2016/12/cs1-th.jpg',
            }]};
    },

    render() {
        return (
            <DocumentTitle title="CASE STUDY ● dot by dot inc.">
                <div>
                    <hr className='line'/>
                    {this.state.items.map(item => <Item key={item.guid} item={item}/>)}
                    <RouteHandler/>
                </div>
            </DocumentTitle>
        );
    }
});
