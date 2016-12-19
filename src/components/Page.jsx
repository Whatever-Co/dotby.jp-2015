var React = require('react/addons');
var cx = React.addons.classSet;
var Router = require('react-router');
var {State, Navigation} = Router;
var DocumentTitle = require('react-document-title');
var MobileDetect = require('mobile-detect');
var isMobile = !!new MobileDetect(navigator.userAgent).mobile();
var moment = require('moment');
moment.locale('en');
var $ = require('jquery');
var GoogleMapsLoader = require('google-maps');

var DotEvents = require('./Dots/Events');
var NotFound = require('./NotFound');
var Lang = require('./Lang');

var mapStyle = [{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-100},{"lightness":20}]},{"featureType":"road","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-100},{"lightness":40}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-10},{"lightness":30}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"visibility":"simplified"},{"saturation":-60},{"lightness":10}]},{"featureType":"landscape.natural","elementType":"all","stylers":[{"visibility":"simplified"},{"saturation":-60},{"lightness":60}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"},{"saturation":-100},{"lightness":60}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"},{"saturation":-100},{"lightness":60}]}];


module.exports = React.createClass({

    mixins: [State, Navigation, Lang],

    getInitialState() {
        return {
            loading: true,
            entry: null
        };
    },

    getEntry() {
        var params = this.getParams();
        var path = [params.parent, params.page].filter((p) => !!p)
        $.getJSON(`/wp-json/pages/${path.join('/')}`, {lang: this.context.lang, _wp_json_nonce: window.nonce}).done((result) => {
            this.setState({loading: false, entry: result});
            var iframes = $('iframe', this.getDOMNode());
            if (iframes.size() > 0) {
                iframes.each((index, element) => {
                    var el = $(element);
                    el.data({aspect: el.attr('width') / el.attr('height')});
                });
                this._iframes = iframes;
            }
            if (result.featured_image) {
                $(window).on('resize', this._onResize);
                this._onResize();
            }
        }).fail(() => {
            this.setState({loading: false});
        });
    },

    componentDidMount() {
        this.getEntry();
    },

    componentWillUnmount() {
        DotEvents.removeListener('colorChanged', this._onChangeColor);
        $(window).off('resize', this._onResize);
    },

    componentWillReceiveProps() {
        this.getEntry();
    },

    _onResize() {
        var width = $(this.refs.entry.getDOMNode()).outerWidth();
        var height = Math.floor(width / 960 * 430);
        var size = {'background-size': `${width}px ${height}px`};
        $(this.refs.entry.getDOMNode()).css(size);
        $(this.refs.inner.getDOMNode()).css(size).css('padding-top', height - (isMobile ? 17 : 34));

        if (this._iframes) {
            width = $(this.refs.body.getDOMNode()).width();
            this._iframes.each((index, element) => {
                var el = $(element);
                el.attr({width: width, height: width / el.data('aspect')});
            });
        }

        var map = $('.map', this.getDOMNode());
        map.height(map.width());
    },

    _setMap() {
        GoogleMapsLoader.load((google) => {
            var el = $('.map', this.getDOMNode())[0];
            var center = new google.maps.LatLng(35.66146, 139.7031013);
            var options = {
                zoom: 17,
                center: center,
                disableDefaultUI: true,
                zoomControl: true,
                zoomControlOptions: {
                    style: google.maps.ZoomControlStyle.SMALL
                },
                scrollwheel: false,
                mapTypeId: 'custom'
            };
            this._map = new google.maps.Map(el, options);
            var custom = new google.maps.StyledMapType(mapStyle, {name: 'custom'});
            this._map.mapTypes.set('custom', custom);
            this._marker = new google.maps.Marker({
                position: center,
                map: this._map,
                icon: {
                    path: 'M30,15c0-8.3-6.7-15-15-15S0,6.7,0,15c0,7.6,5.6,13.8,12.9,14.8L15,36l2.1-6.2C24.4,28.8,30,22.6,30,15z',
                    fillColor: '#000000',
                    fillOpacity: 0.8,
                    strokeWeight: 0,
                    anchor: new google.maps.Point(15, 36)
                }
            });
            DotEvents.addListener('colorChanged', this._onChangeColor);
            if (isMobile) {
                $(window).on('resize', this._onResize);
                this._onResize();
            }
        });
    },

    _onChangeColor(color) {
        var icon = this._marker.getIcon();
        icon.fillColor = color;
        this._marker.setIcon(icon);
    },

    componentDidUpdate() {
        if (this.getPathname() == this.context.langPrefix + '/about/') {
            this._setMap();
            $('a[href^="/members/"]', this.getDOMNode()).click(e => {
                e.preventDefault();
                this.transitionTo(this.context.langPrefix + $(e.currentTarget).attr('href'));
            });
        }
    },

    render() {
        if (this.state.loading) return <div/>;
        if (!this.state.entry) return <NotFound/>;
        var entry = this.state.entry;
        var style = {backgroundImage: entry.featured_image ? `url(${entry.featured_image.source})` : ''};
        var pageClass = 'page-' + this.getPathname().substr(this.context.langPrefix.length).replace(/[^\w]/g, '');
        var parent = this.getParams().parent
        var title = entry.title
        var content = entry.content
        if (parent == 'case-study') {
            title = title.replace(/Case study #\d+/i, '$&<br/>')
            content = content.replace(/^<p><br \/>\n/, '<p>')
        }
        return (
            <DocumentTitle title={entry.title + ' ● dot by dot inc.'}>
                <div>
                    <div key={entry.guid}>
                        <hr className="line"/>
                        <div className={cx({entry: true, 'with-image': entry.featured_image}) + ` ${parent} ${pageClass}`} ref='entry' style={style}>
                            <div className={cx({inner: true, hover: isMobile})} ref="inner" style={style}>
                                {parent == 'case-study'? <div><h1 className="title" dangerouslySetInnerHTML={{__html: title}}/><span className="date">{moment(entry.date_gmt).format('LL')}</span></div> : null}
                                <div className="body" ref="body" dangerouslySetInnerHTML={{__html: content}}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </DocumentTitle>
        );
    }
});
