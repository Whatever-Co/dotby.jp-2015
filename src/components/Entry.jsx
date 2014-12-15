var React = require('react');
var Router = require('react-router');
var {Navigation, Link} = Router;
var moment = require('moment');
moment.locale('en');
var $ = require('jquery');


module.exports = React.createClass({
    mixins: [Navigation],
    //_originalHeight: 0,
    //_onMouseEnter() {
    //    return;
    //    $(this.refs.entry.getDOMNode()).addClass('over');
    //    return;
    //    inner = $(this.refs.inner.getDOMNode());
    //    this._originalHeight = height = parseInt(inner.css('height'));
    //    inner.css({height: height});
    //    body = $(this.refs.body.getDOMNode()).css({opacity: 0}).show().transition({opacity: 1});
    //    inner.transition({
    //        height: height + body.outerHeight() + 40,
    //        complete() {
    //            inner.attr('style', null);
    //        }
    //    });
    //},
    //_onMouseLeave() {
    //    return;
    //    $(this.refs.entry.getDOMNode()).removeClass('over');
    //    return;
    //    inner = $(this.refs.inner.getDOMNode());
    //    inner.css({height: inner.css('height')});
    //    inner.transition({
    //        height: this._originalHeight,
    //        complete() {
    //            inner.attr('style', null);
    //        }
    //    });
    //    body = $(this.refs.body.getDOMNode()).transition({
    //        opacity: 0,
    //        complete() {
    //            body.hide();
    //        }
    //    });
    //},
    _onClickMember(e) {
        e.preventDefault();
        this.transitionTo($(e.currentTarget).attr('href'));
    },
    _onResize() {
        this._image.height(this._image.width() / 960 * 430);
        if (this._iframes) {
            var width = $(this.refs.body.getDOMNode()).width();
            this._iframes.each((index, element) => {
                var el = $(element);
                el.attr({width: width, height: width / el.data('aspect')});
            });
        }
    },
    componentDidMount() {
        if (this.refs.credit) {
            this._memberLink = $('a', this.refs.credit.getDOMNode()).not('[href^="http"]').click(this._onClickMember);
        }
        var needResize = false;
        if (this.refs.image) {
            this._image = $(this.refs.image.getDOMNode());
            needResize = true;
        }
        var iframes = $('iframe', this.getDOMNode());
        if (iframes.size() > 0) {
            iframes.each((index, element) => {
                var el = $(element);
                el.data({aspect: el.attr('width') / el.attr('height')});
            });
            this._iframes = iframes;
            needResize = true;
        }
        if (needResize) {
            $(window).on('resize', this._onResize);
            this._onResize();
        }
    },
    componentWillUnmount() {
        if (this._memberLink) {
            this._memberLink.off();
        }
        $(window).off('resize', this._onResize);
    },
    render() {
        var entry = this.props.entry;
        if (entry.meta.credit) {
            var credit = entry.meta.credit.split('\n').map((item) => {
                [title, name, link] = item.split(',');
                title = title.trim();
                name = name.trim();
                if (link) link = link.trim();
                if (link) {
                    return <span key={title + name + link}>{title}: <a href={link} target="_blank">{name}</a></span>;
                } else {
                    return <span key={title + name + link}>{title}: {name}</span>
                }
            });
        }
        return (
            <div className="entry" ref="entry" onMouseEnter={this._onMouseEnter} onMouseLeave={this._onMouseLeave}>
                {entry.featured_image ? (
                    <div className="featured-image" ref="image" style={{backgroundImage: `url(${entry.featured_image.source})`}}>
                        <div className="border"/>
                    </div>
                ) : null}
                <div className="inner" ref="inner">
                    <h1 className="title" dangerouslySetInnerHTML={{__html: entry.title}}/>
                    <span className="date"><Link to={`/post/${entry.slug}/`}>{moment(entry.date_gmt).format('LL')}</Link></span>
                    <div className="body" ref="body">
                        <div dangerouslySetInnerHTML={{__html: entry.content}}/>
                        {entry.terms.category[0].slug == 'work' ? (
                            <table>
                                <tbody>
                                {entry.meta.awards ? (
                                    <tr className="award">
                                        <th>AWARD</th>
                                        <td>
                                            {entry.meta.awards.map(item => item ? <img key={item} src={`/assets/${item}.png`}/> : false)}
                                        </td>
                                    </tr>
                                ) : null}
                                    <tr className="credit">
                                        <th>CREDIT</th>
                                        <td ref="credit">{credit}</td>
                                    </tr>
                                </tbody>
                            </table>
                        ) : null}
                    </div>
                </div>
            </div>
        );
    }
});
