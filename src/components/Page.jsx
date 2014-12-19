var React = require('react/addons');
var cx = React.addons.classSet;
var Router = require('react-router');
var {State, Navigation} = Router;
var MobileDetect = require('mobile-detect');
var isMobile = !!new MobileDetect(navigator.userAgent).mobile();
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
        $.getJSON(`/wp-json/pages/${params.page}`, {lang: this.context.lang}).done((result) => {
            this.setState({loading: false, entry: result});
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
        this.getEntries();
    },

    _onResize() {
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
        }
    },

    render() {
        if (this.state.loading) return <div/>;
        if (!this.state.entry) return <NotFound/>;
        var entry = this.state.entry;
        var clsName = 'page-' + this.getPathname().substr(this.context.langPrefix.length).replace(/[^\w]/g, '');
        return (
            <div>
                <div key={entry.guid}>
                    <hr className="line"/>
                    <div className={'entry ' + clsName}>
                        <div className={cx({inner: true, hover: isMobile})} ref="inner">
                            <div className="body" ref="body" dangerouslySetInnerHTML={{__html: entry.content}}></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
