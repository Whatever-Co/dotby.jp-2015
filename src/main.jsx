var React = require('react');
var Router = require('react-router');
var {Route, DefaultRoute, NotFoundRoute, RouteHandler, Link} = Router;
var $ = require('jquery');
require('jquery.transit');

var EntryList = require('./components/EntryList');
var Page = require('./components/Page');
var NotFound = require('./components/NotFound');
var Application = require('./components/Application');


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
