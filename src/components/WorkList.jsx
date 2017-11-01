var _ = require('underscore')
var request = require('request')
var classnames = require('classnames')
var React = require('react')
var Route = require('react-router')
var {State} = Route
var DocumentTitle = require('react-document-title')

var WorkItem = require('./WorkItem')

var MEMBER_DATA = require('../data').members
var Lang = require('./Lang')


module.exports = React.createClass({

    displayName: 'WorkList',

    mixins: [State, Lang],

    getInitialState() {
        return {tags: [], entries: []}
    },

    componentDidMount() {
        this.selectedTag = null
        this.loadTags()
        this.loadEntries()
    },

    loadTags() {
        var qs = {
            lang: this.context.lang,
            _wp_json_nonce: window.nonce,
        }
        request({url: location.origin + '/wp-json/taxonomies/post_tag/terms', qs: qs}, (error, response, body) => {
            var tags = JSON.parse(body).filter(tag => !(tag.slug in MEMBER_DATA))
            this.setState({tags: tags})
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
            this.applyFilter(JSON.parse(body))
        })
    },

    applyFilter(entries = null) {
        if (!entries) {
            entries = this.state.entries
        }
        if (this.selectedTag) {
            entries.forEach(entry => entry.match = _.find(entry.terms.post_tag, t => t.slug == this.selectedTag.slug))
        } else {
            entries.forEach(entry => entry.match = true)
        }
        this.setState({entries: entries})
    },

    _onClickTag(tag) {
        if (tag == this.selectedTag) {
            tag.selected = false
            this.selectedTag = null
        } else {
            if (this.selectedTag) {
                this.selectedTag.selected = false
            }
            tag.selected = true
            this.selectedTag = tag
        }
        this.setState(this.state.tags)
        this.applyFilter()
    },

    render() {
        return (
            <DocumentTitle title="WORK">
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
