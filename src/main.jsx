var React = require('react');
var Router = require('react-router');
var {Route, DefaultRoute, NotFoundRoute} = Router;
var $ = require('jquery');
require('jquery.transit');

var EntryList = require('./components/EntryList');
var Page = require('./components/Page');
var NotFound = require('./components/NotFound');
var MemberList = require('./components/MemberList');
var Application = require('./components/Application');


var routes = (
    <Route path="/" handler={Application}>
        <DefaultRoute handler={EntryList}/>
        <Route path="/category/:category" handler={EntryList}/>
        <Route path="/members" handler={MemberList}/>
        <Route path="/:page" handler={Page}/>
        <NotFoundRoute handler={NotFound}/>
    </Route>
);


Router.run(routes, Router.HistoryLocation, (Handler, state) => {
    if (state.path == '/members') {
        var members = ['yusuke', 'saqoosha', 'heri', 'sfman', 'seki'].map((name) => {
            return $.getJSON(`http://dotby.jp/wp-json/pages/members/${name}`);
        });
        $.when.apply(null, members).done(()=> {
            var result = Array.prototype.map.call(arguments, (result) => result[0]);
            React.render(<Handler data={result}/>, document.body);
        });
    } else {
        var apiPath = 'posts';
        var data = {};
        if (state.params.category) {
            data['filter[category_name]'] = state.params.category;
        } else if (state.params.page) {
            apiPath = 'pages/' + state.params.page;
        }
        $.getJSON(`http://dotby.jp/wp-json/${apiPath}`, data).done((result) => {
            React.render(<Handler data={result}/>, document.body);
        });
    }
});
