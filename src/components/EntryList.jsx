var React = require('react');
var Route = require('react-router');
var {State} = Route;
var $ = require('jquery');
var MobileDetect = require('mobile-detect');
var isMobile = !!new MobileDetect(navigator.userAgent).mobile();

var Entry = require('./Entry');
var Lang = require('./Lang');


module.exports = React.createClass({

    displayName: 'EntryList',

    mixins: [State, Lang],

    getInitialState() {
        return {entries: []}
    },

    getEntries() {
        var params = this.getParams();
        var data = {lang: this.context.lang, page: this._currentPage};
        if (params.category) {
            data['filter[category_name]'] = params.category;
        }
        return $.getJSON('/wp-json/posts', data).done(result => {
            this._loading = !result.length;
            this.setState({entries: this.state.entries.concat(result)});
        });
    },

    componentDidMount() {
        this._loading = false;
        this._currentPage = 1;
        this.setState({entries: []});
        this.getEntries().then(() => {
            $(window).on('scroll', this._onScroll);
            this._onScroll();
        });
    },

    componentWillUnmount() {
        $(window).off('scroll', this._onScroll);
    },

    componentWillReceiveProps() {
        console.log('EntryList::componentWillReceiveProp()');
        this._currentPage = 1;
        this.setState({entries: []});
        this.getEntries();
    },

    componentDidUpdate() {
        this._onScroll();
    },

    _onScroll() {
        if (isMobile) {
            this._setFocus();
        }

        if (!this._loading && this.state.entries.length > 0) {
            var win = $(window).height();
            var doc = $(document.body).outerHeight();
            var bottom = doc - win - $(window).scrollTop();
            if (bottom < 200) {
                this._loading = true;
                this._currentPage++;
                this.getEntries();
            }
        }
    },

    _setFocus() {
        var win = $(window).height();
        var doc = $(document.body).outerHeight();
        if (doc <= win) return;

        var p = $(window).scrollTop() / (doc - win);
        var y0 = 150;
        var y1 = $(window).height() - 55;
        var yy = y0 + (y1 - y0) * p;
        var el = $(document.elementFromPoint(window.innerWidth / 2, yy));
        var entry = null;
        while (el.length && !inner) {
            el = el.parent();
            if (el.hasClass('entry')) {
                entry = el;
            }
        }
        if (!entry) return;
        var inner = $('.inner', entry);
        if (inner.length) {
            if (this._current) {
                this._current.removeClass('hover');
            }
            this._current = inner;
            this._current.addClass('hover');
        }
    },

    render() {
        return (
            <div>
                {this.state.entries.map((entry) => {
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
