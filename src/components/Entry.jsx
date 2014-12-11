var React = require('react');
var Router = require('react-router');
var {Link} = Router;
var moment = require('moment');
moment.locale('en');


module.exports = React.createClass({
    _originalHeight: 0,
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
    render() {
        var entry = this.props.entry;
        if (entry.featured_image) {
            return (
                <div className="entry" ref="entry" onMouseEnter={this._onMouseEnter} onMouseLeave={this._onMouseLeave}>
                    <div className="featured-image" style={{backgroundImage: `url(${entry.featured_image.source})`}}>
                        <div className="border"/>
                    </div>
                    <div className="inner" ref="inner">
                        <h1 className="title" dangerouslySetInnerHTML={{__html: entry.title}}/>
                        <span className="date"><Link to={`/post/${entry.slug}/`}>{moment(entry.date_gmt).format('LL')}</Link></span>
                        <div className="body" ref="body" dangerouslySetInnerHTML={{__html: entry.content}}></div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="entry" ref="entry" onMouseEnter={this._onMouseEnter} onMouseLeave={this._onMouseLeave}>
                    <div className="inner" ref="inner">
                        <h1 className="title" dangerouslySetInnerHTML={{__html: entry.title}}/>
                        <span className="date"><Link to={`/post/${entry.slug}/`}>{moment(entry.date_gmt).format('LL')}</Link></span>
                        <div className="body" ref="body" dangerouslySetInnerHTML={{__html: entry.content}}></div>
                    </div>
                </div>
            );
        }
    }
});
