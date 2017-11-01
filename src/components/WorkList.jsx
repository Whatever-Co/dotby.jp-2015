var _ = require('underscore')
var request = require('request')
var classnames = require('classnames')
var React = require('react')
var Route = require('react-router')
var {State, Navigation, RouteHandler} = Route
var DocumentTitle = require('react-document-title')

var WorkItem = require('./WorkItem')

var MEMBER_DATA = require('../data').members
var Lang = require('./Lang')


module.exports = React.createClass({

    displayName: 'WorkList',

    mixins: [State, Navigation, Lang],

    getInitialState() {
        return {tags: [], entries: []}
    },

    componentDidMount() {
        this.loadTags()
        this.loadEntries()
    },

    loadTags() {
        var qs = {
            lang: this.context.lang,
            _wp_json_nonce: window.nonce,
        }
        request({url: location.origin + '/wp-json/taxonomies/post_tag/terms', qs: qs}, (error, response, body) => {
            this.updateTags(JSON.parse(body).filter(tag => !(tag.slug in MEMBER_DATA)))
        })
    },

    loadEntries() {
        var qs = {
            lang: this.context.lang,
            'filter[category_name]': 'work',
            'filter[posts_per_page]': 1000,
            _wp_json_nonce: window.nonce,
        }
        request({url: location.origin + '/wp-json/posts', qs: qs}, (error, response, body) => {
            this.updateEntries(JSON.parse(body))
        })
    },

    componentWillReceiveProps() {
        this.updateTags()
        this.updateEntries()
    },

    updateTags(tags) {
        if (!tags) {
            tags = this.state.tags
        }
        var selected = this.getParams().tag
        tags.forEach(tag => tag.selected = tag.slug == selected)
        this.setState({tags: tags})
    },

    updateEntries(entries) {
        if (!entries) {
            entries = this.state.entries
        }
        var selected = this.getParams().tag
        entries.forEach(entry => entry.match = selected ? !!_.find(entry.terms.post_tag, tag => tag.slug == selected) : true)
        this.setState({entries: entries})
    },

    _onClickTag(tag) {
        if (tag.selected) {
            this.transitionTo(`${this.context.langPrefix}/category/work/`);
        } else {
            this.transitionTo(`${this.context.langPrefix}/category/work/${tag.slug}/`);
        }
    },

    render() {
        return (
            <DocumentTitle title="WORK ● dot by dot inc.">
                <div className="work-list">
                    <hr className="line"/>
                    <ul className="tag-list">
                        {this.state.tags.map(tag => <li key={tag.slug} className={classnames({selected: tag.selected})} onClick={this._onClickTag.bind(this, tag)}>{tag.name}</li>)}
                    </ul>
                    <div className="work-items">
                        {this.state.entries.map(entry => <WorkItem key={entry.guid} {...entry}/>)}
                    </div>
                </div>
            </DocumentTitle>
        )
    },

})
