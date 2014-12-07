var React = require('react');

var MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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
        console.log(entry);
        var date = new Date(entry.date_gmt);
        if (entry.featured_image) {
            return (
                <div className="entry" ref="entry" onMouseEnter={this._onMouseEnter} onMouseLeave={this._onMouseLeave}>
                    <div className="featured-image" style={{backgroundImage: `url(${entry.featured_image.source})`}}>
                        <div className="border"/>
                    </div>
                    <div className="inner" ref="inner">
                        <h1 className="title" dangerouslySetInnerHTML={{__html: entry.title}}/>
                        <span className="date">{`${MONTH_NAMES[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`}</span>
                        <div className="body" ref="body" dangerouslySetInnerHTML={{__html: entry.content}}></div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="entry" ref="entry" onMouseEnter={this._onMouseEnter} onMouseLeave={this._onMouseLeave}>
                    <div className="inner" ref="inner">
                        <h1 className="title" dangerouslySetInnerHTML={{__html: entry.title}}/>
                        <span className="date">{`${MONTH_NAMES[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`}</span>
                        <div className="body" ref="body" dangerouslySetInnerHTML={{__html: entry.content}}></div>
                    </div>
                </div>
            );
        }
    }
});
