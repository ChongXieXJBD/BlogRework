'use strict';
/**
 * Created by dtysky on 16/2/3.
 */


var React = require('react');
var Link = require('react-router').Link;
var format = require('util').format;

var Loading = require('./loading');
var NormalError = require('./normal_error');

var cache = require('./cache');
var getLocalUrl = require('./utils').getLocalUrl;
var redirect = require('./utils').redirect;
var config = require('./utils').config;
var site_title = config.site_title;
var server_url = config.server_url;

require('./theme/css/sky.css');
require('./theme/css/article.css');

module.exports = React.createClass({
    getInitialState: function(){
        return {
            content: []
        };
    },
    getAll: function(name){
        this.setState({
            state: "wait"
        });
        $.ajax({
            url: format(
                "%s/%s",
                server_url,
                name
            ),
            success: function(data, status){
                cache.add(name, data);
            }.bind(this),
            error: function(obj, info, ex){
                console.log(obj);
                if(obj.status === 404){
                    redirect();
                }
                else{
                    this.setState({
                        state: "error"
                    });
                }
            }.bind(this)
        });
    },
    getInfo: function(name){
        var data = cache.get(name);
        this.setState({
            state: "ok",
            content: data.content
        });
        this.props.handleHead({
            title: format("%s - %s", "Authors", site_title),
            keywords: "Authors",
            description: "所有的少女",
            author: "dtysky,命月天宇",
            rss: "/feeds/all"
        });
    },
    componentDidMount: function(){
        var self = this;
        var name = format(
            "%s/%s",
            "authors",
            "all"
        );
        if(!cache.has(name)){
            this.getAll(name);
            var timeoutId = 0;
            var fun = function() {
                if (cache.has(name)) {
                    clearTimeout(timeoutId);
                    self.getInfo(name);
                }
                else if (self.state.state !== "error"){
                    timeoutId = setTimeout(fun, 500);
                }
            };
            fun();
        }
        else{
            self.getInfo(name);
        }
        if(this.props.theme_default !== "authors"){
            this.props.setDefaultTheme("authors");
            this.props.changeTheme("authors", true);
        }
        this.props.setMusicList([]);
    },
    render: function(){
        if (this.state.state === "error"){
            return <NormalError key="normal-error"/>;
        }
        if (this.state.state === "wait"){
            return <Loading key="wait"/>;
        }
        return (
            <ul className="authors-list">
                {
                    this.state.content.map(function(author){
                        return (
                            <li><Link
                                to={getLocalUrl("author", author.slug, null)}
                            >
                                {author.view}
                            </Link></li>
                        );
                    })
                }
            </ul>
        );
    }
});