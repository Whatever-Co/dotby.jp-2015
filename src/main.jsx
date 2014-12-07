var React = require('react');
var Router = require('react-router');
var {Route, DefaultRoute, NotFoundRoute, RouteHandler, Link} = Router;
var $ = require('jquery');
require('jquery.transit');


var Dots = React.createClass({
    render() {
        return (
            <div id="dots"/>
        );
    }
});


var Header = React.createClass({
    render() {
        return (
            <div id="header">
                <Link to="/" id="logo">
                    <img src="/images/logo.svg" width="190"/>
                </Link>
                <ul id="menu">
                    <li>
                        <Link to="/about">ABOUT</Link>
                    </li>
                    <li>
                        <Link to="/members">MEMBERS</Link>
                    </li>
                    <li>
                        <Link to="/category/works">WORKS</Link>
                    </li>
                    <li>
                        <Link to="/category/news">NEWS</Link>
                    </li>
                </ul>
            </div>
        );
    }
});


var MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

var Entry = React.createClass({
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


var EntryList = React.createClass({
    getDefaultProps() {
        return {data: []};
    },
    render() {
        return (
            <div>
                {this.props.data.map((entry) => {
                    return (
                        <div key={entry.guid}>
                            <hr className="line"/>
                            <Entry entry={entry} />
                        </div>
                    );
                })}
            </div>
        );
    }
});


var Page = React.createClass({
    getDefaultProps() {
        return {data: []};
    },
    render() {
        if (this.props.data.length == 0) return <h1 className="notfound">PAGE NOT FOUND!</h1>;
        var entry = this.props.data[0];
        return (
            <div>
                <div key={entry.guid}>
                    <hr className="line"/>
                    <div className="entry">
                        <div className="inner" ref="inner">
                            <div className="body" ref="body" dangerouslySetInnerHTML={{__html: entry.content}}></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});


var NotFound = React.createClass({
    render() {
        return <h1 className="notfound">PAGE NOT FOUND!</h1>;
    }
});


var Application = React.createClass({
    getInitialState() {
        return {entries: []};
    },
    render() {
        return (
            <div>
                <Dots/>
                <div id="container" className="clearfix">
                    <Header/>
                    <RouteHandler {...this.props}/>
                </div>
            </div>
        );
    }
});


var routes = (
    <Route path="/" handler={Application}>
        <DefaultRoute handler={EntryList}/>
        <Route path="/category/:category" handler={EntryList}/>
        <Route path="/:page" handler={Page}/>
        <NotFoundRoute handler={NotFound}/>
    </Route>
);


Router.run(routes, Router.HistoryLocation, (Handler, state) => {
    console.log(state);
    var apiPath = 'posts';
    var data = {};
    if (state.params.category) {
        data['filter[category_name]'] = state.params.category;
    } else if (state.params.page) {
        apiPath = 'pages';
        data['filter[name]'] = state.params.page;
    }
    $.getJSON(`http://dotby.jp/wp-json/${apiPath}`, data).done((result) => {
        //console.log(result);
        React.render(<Handler data={result}/>, document.body);
    });
});
