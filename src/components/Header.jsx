var React = require('react');
var Router = require('react-router');
var {Link} = Router;


module.exports = React.createClass({
    render() {
        return (
            <div id="header">
                <Link to="/" id="logo">
                    <img src="/assets/logo.svg" width="190"/>
                </Link>
                <ul id="menu">
                    <li>
                        <Link to="/about/">ABOUT</Link>
                    </li>
                    <li>
                        <Link to="/members/">MEMBERS</Link>
                    </li>
                    <li>
                        <Link to="/category/works/">WORKS</Link>
                    </li>
                    <li>
                        <Link to="/category/news/">NEWS</Link>
                    </li>
                </ul>
            </div>
        );
    }
});
