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
    componentDidMount() {
        if (this.refs.credit) {
            $('a', this.refs.credit.getDOMNode()).not('[href^="http"]').click(this._onClickMember);
        }
    },
    componentWillUnmount() {
        if (this.refs.credit) {
            $('a', this.refs.credit.getDOMNode()).off('click');
        }
    },
    render() {
        var entry = this.props.entry;
        var content = $(entry.content);
        $('a[href^="http"]', content).attr({target: '_blank'});
        var award = content.filter('.award').text().trim();
        var credit = content.filter('.credit');
        var body = '';
        content.not('.award, .credit').each((index, element) => {
            var t = element.outerHTML;
            if (t) body += t;
        });
        return (
            <div className="entry" ref="entry" onMouseEnter={this._onMouseEnter} onMouseLeave={this._onMouseLeave}>
                {entry.featured_image ? (
                    <div className="featured-image" style={{backgroundImage: `url(${entry.featured_image.source})`}}>
                        <div className="border"/>
                    </div>
                ) : null}
                <div className="inner" ref="inner">
                    <h1 className="title" dangerouslySetInnerHTML={{__html: entry.title}}/>
                    <span className="date"><Link to={`/post/${entry.slug}/`}>{moment(entry.date_gmt).format('LL')}</Link></span>
                    <div className="body" ref="body">
                        <div dangerouslySetInnerHTML={{__html: body}}/>
                        {entry.terms.category[0].slug == 'works' ? (
                            <table>
                                <tbody>
                                {award ? (
                                    <tr className="award">
                                        <th>AWARD</th>
                                        <td>
                                            {award.split(',').map(item => item ? <img key={item} src={`/assets/${item}.png`}/> : false)}
                                        </td>
                                    </tr>
                                ) : null}
                                    <tr className="credit">
                                        <th>CREDIT</th>
                                        <td ref="credit" dangerouslySetInnerHTML={{__html: credit.html()}}/>
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

