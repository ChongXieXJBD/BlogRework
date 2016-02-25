'use strict';
/**
 * Created by dtysky on 16/2/3.
 */

var React = require('react/addons');
var config = require('./utils').config;
var templates = config.share_templates;

require('./theme/css/share.css');

module.exports = React.createClass({
    format_template: function(t_url){
        var data = this.props.info;
        return t_url.replace(/\{\{(\w)(\w*)\}\}/g, function(m, fix, key){
            key = (fix + key).toLowerCase();
            console.log(key, data[key]);
            return encodeURIComponent(data[key] || '');
        });
    },
    onClick: function(){

    },
    componentDidUpdate: function(){
    },
    render: function() {
        var self = this;
        return (
            <div>
                <div
                    className="share-button"
                    onClick={this.onClick}
                >
                </div>
                <div className="share-window">
                    {
                        templates.map(function(t){
                            return (
                                <a
                                    href={self.format_template(t[1])}
                                    className={"share-icon icon-" + t[0]}
                                >
                                </a>
                            );
                        })
                    }
                    {
                        //wechat
                    }
                    <img src=""/>
                </div>
            </div>
        );
    }
});