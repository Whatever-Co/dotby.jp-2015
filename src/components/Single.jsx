var React = require('react');
var Router = require('react-router');
var {State} = Router;
var DocumentTitle = require('react-document-title');
var $ = require('jquery');
var MobileDetect = require('mobile-detect');
var isMobile = !!new MobileDetect(navigator.userAgent).mobile();

var Entry = require('./Entry');
var NotFound = require('./NotFound');
var Lang = require('./Lang');


module.exports = React.createClass({

    mixins: [State, Lang],

    getInitialState() {
        return {
            loading: true,
            entry: null
        }
    },

    getEntry() {
        var data = {
            'filter[name]': this.getParams().post,
            lang: this.context.lang
        };
        $.getJSON('/wp-json/posts', data).done(result => {
            this.setState({loading: false, entry: result[0]});
        }).fail(() => {
            this.setState({loading: false});
        });
    },

    componentDidMount() {
        this.getEntry();
    },

    componentWillReceiveProps() {
        this.getEntry();
    },

    decodeHtml(html) {
        var txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    },

    render() {
        return (
            <DocumentTitle title={(this.state.loading ? '' :
                this.state.entry ? this.decodeHtml(this.state.entry.title) + ' ● ' : 'Page Not Found ● ') + 'dot by dot inc.'}>
                <div>
                    <hr className="line"/>
                    {this.state.loading ? '' :
                        this.state.entry ? <Entry entry={this.state.entry} single={isMobile}/> : <NotFound/>}
                </div>
            </DocumentTitle>
        );
    }
});
