var React = require('react');
var Router = require('react-router');
var {Route, DefaultRoute, NotFoundRoute} = Router;
var $ = require('jquery');
require('jquery.transit');
var MobileDetect = require('mobile-detect');

var EntryList = require('./components/EntryList');
var Single = require('./components/Single');
var Page = require('./components/Page');
var NotFound = require('./components/NotFound');
var MemberList = require('./components/MemberList');
var MemberDetail = require('./components/MemberDetail');
var Application = require('./components/Application');


var mb = new MobileDetect(navigator.userAgent);
if (mb.mobile()) {
    $('body').addClass('mobile');
}

React.initializeTouchEvents(true);


var routes = (
    <Route name="Application" path="/" handler={Application}>
        <DefaultRoute name="Root" handler={EntryList}/>
        <Route name="Category" path="/category/:category/" handler={EntryList}/>
        <Route name="MemberList" path="/members/" handler={MemberList}>
            <Route name="MemberDetail" path="/members/:member/" handler={MemberDetail}/>
        </Route>
        <Route name="Page" path="/:page/" handler={Page}/>
        <Route name="Post" path="/post/:post/" handler={Single}/>
        <NotFoundRoute handler={NotFound}/>
    </Route>
);


Router.run(routes, Router.HistoryLocation, (Handler, state) => {
    React.render(<Handler/>, document.body);
});
