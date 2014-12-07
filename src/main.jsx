var React = require('react');
var Router = require('react-router');
var {Route, DefaultRoute, RouteHandler, Link} = Router;
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
                        <a href="#">MEMBERS</a>
                    </li>
                    <li>
                        <a href="#">WORKS</a>
                    </li>
                    <li>
                        <a href="#">NEWS</a>
                    </li>
                    <li>
                        <a href="#">AWARDS</a>
                    </li>
                </ul>
            </div>
        );
    }
});


var MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

var Entry = React.createClass({
    _originalHeight: 0,
    _onMouseEnter() {
        return;
        $(this.refs.entry.getDOMNode()).addClass('over');
        return;
        inner = $(this.refs.inner.getDOMNode());
        this._originalHeight = height = parseInt(inner.css('height'));
        inner.css({height: height});
        body = $(this.refs.body.getDOMNode()).css({opacity: 0}).show().transition({opacity: 1});
        inner.transition({
            height: height + body.outerHeight() + 40,
            complete() {
                inner.attr('style', null);
            }
        });
    },
    _onMouseLeave() {
        return;
        $(this.refs.entry.getDOMNode()).removeClass('over');
        return;
        inner = $(this.refs.inner.getDOMNode());
        inner.css({height: inner.css('height')});
        inner.transition({
            height: this._originalHeight,
            complete() {
                inner.attr('style', null);
            }
        });
        body = $(this.refs.body.getDOMNode()).transition({
            opacity: 0,
            complete() {
                body.hide();
            }
        });
    },
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
                        <h1 className="title">{entry.title}</h1>
                        <span className="date">{`${MONTH_NAMES[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`}</span>
                        <div className="body" ref="body" dangerouslySetInnerHTML={{__html: entry.content}}></div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="entry" ref="entry" onMouseEnter={this._onMouseEnter} onMouseLeave={this._onMouseLeave}>
                    <div className="inner" ref="inner">
                        <h1 className="title">{entry.title}</h1>
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
        return {entries: []};
    },
    render() {
        return (
            <div>
                {this.props.entries.map((entry) => {
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


var About = React.createClass({
    render() {
        return (<div>aboutttttt</div>);
    }
});


var Application = React.createClass({
    getInitialState() {
        return {entries: []};
    },
    //componentDidMount() {
    //    $.getJSON('http://dotby.jp/wp-json/posts?lang=ja').done((result) => {
    //        this.setState({entries: result});
    //    });
    //},
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
        <Route path="/about" handler={About}/>
    </Route>
);


//React.render(
//    <Application/>,
//    document.body
//);

Router.run(routes, Router.HistoryLocation, (Handler, state) => {
    console.log(state);
    $.getJSON('http://dotby.jp/wp-json/posts?lang=ja').done((result) => {
        React.render(<Handler entries={result}/>, document.body);
    });
});
