React = require('react');
Fluxxor = require('fluxxor');


var Header = React.createClass({
    render() {
        return (
            <div id="header">
                <a id="logo" href="/">
                    <img src="images/logo.svg" width="190"/>
                </a>
                <img id="menu" ref="menu" src="images/menu.svg" width="960"/>
            </div>
        );
    }
});


var Entry = React.createClass({
    render() {
        return (
            <div className="entry">
                <img className="line" src="images/line.png"/>
                <img src="_tmp/tc.jpg"/>
                <h1 className="title">Yahoo! Trend Coaster</h1>
                <span className="date">September 30, 2014</span>
                <div className="body">
                    <p><iframe src="//www.youtube.com/embed/0dl1BNbPkOk" width="768" height="432" frameborder="0" allowfullscreen="allowfullscreen"></iframe></p> <p><a href="http://trendcoaster.jp">http://trendcoaster.jp</a></p> <p>「さわれる検索」は、これまでのインターネット利用のスタイルであった「見る」「聞く」ことから、「さわる」ことに発展させたコンセプトモデルです。 「音声検索」「3Dデータベース」「3Dプリンタ」を融合させることにより、声に発したものが、立体物として出力される仕組みとなっています。</p> <p>一般の方々からの3Dデータ投稿も受け付けており、さわれる3Dデータベースは日々拡張中です。 さわれる検索マシンは、筑波大学附属視覚特別支援学校に設置され、生徒さんたちの「さわりたい」に応えています。</p>
                    </div>
            </div>
        );
    }
});


var Application = React.createClass({
    render() {
        return (
            <div id="container">
                <Header/>
                <Entry/>
                <Entry/>
                <Entry/>
            </div>
        );
    }
});


React.render(
    <Application/>,
    document.body
);
