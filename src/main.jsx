var React = require('react');
var Router = require('react-router');
var {Route, DefaultRoute, NotFoundRoute, RouteHandler} = Router;
var $ = require('jquery');
require('jquery.transit');
var MobileDetect = require('mobile-detect');

var EntryList = require('./components/EntryList');
var Single = require('./components/Single');
var Page = require('./components/Page');
var NotFound = require('./components/NotFound');
var MemberList = require('./components/MemberList');
var MemberDetail = require('./components/MemberDetail');
var CaseStudyList = require('./components/CaseStudyList');
var Application = require('./components/Application');

var FaviconAnimator = require('./FaviconAnimator');


var mb = new MobileDetect(navigator.userAgent);
if (mb.mobile()) {
    $('body').addClass('mobile');
} else if (mb.match('chrome') || !mb.match('safari')) {
    new FaviconAnimator();
}

React.initializeTouchEvents(true);


var LangRoot = React.createClass({
    render() {
        return <RouteHandler/>;
    }
});


var routes = (
    <Route name="Application" path="/" handler={Application}>
        <DefaultRoute name="Root" handler={EntryList}/>

        <Route path="en/" handler={LangRoot}>
            <DefaultRoute handler={EntryList}/>
            <Route path="category/:category/" handler={EntryList}/>
            <Route path="members/" handler={MemberList}>
                <Route path=":member/" handler={MemberDetail}/>
            </Route>
            <Route path=":page/" handler={Page}/>
            <Route path="post/:post/" handler={Single}/>
        </Route>

        <Route name="Category" path="category/:category/" handler={EntryList}/>
        <Route name="MemberList" path="members/" handler={MemberList}>
            <Route name="MemberDetail" path=":member/" handler={MemberDetail}/>
        </Route>
        <Route name="CaseStudyList" path="case-study/" handler={CaseStudyList}/>

        <Route name="Post" path="post/:post/" handler={Single}/>

        <Route name="Page" path=":page/" handler={Page}/>
        <Route name="SubPage" path=":parent/:page/" handler={Page}/>

        <NotFoundRoute handler={NotFound}/>
    </Route>
);


Router.run(routes, Router.HistoryLocation, (Handler, state) => {
    var context = {lang: 'ja', langPrefix: ''};
    if (state.pathname.indexOf('/en/') == 0) {
        context.lang = 'en';
        context.langPrefix = '/en';
    }
    React.withContext(context, () => {
        React.render(<Handler/>, document.body);
        ga('send', 'pageview', {page: state.pathname});
    });
});
