'use strict';
/**
 * Created by dtysky on 16/2/3.
 */


var React = require('react');
var VelocityComponent = require('velocity-react').VelocityComponent;
var velocityHelpers = require('velocity-react').velocityHelpers;
var Link = require('react-router').Link;
var config = require('./../utils').config;
var theme_color = config.theme_color;
var animation_default_duration = config.animation_default_duration;

require('./../theme/css/sky.css');

module.exports = React.createClass({
    getInitialState: function(){
        this.cp_list = [
            {
                id: "title-create",
                theme: "Create"
            },
            {
                id: "title-skill",
                theme: "Skill"
            },
            {
                id: "title-art",
                theme: "Art"
            },
            {
                id: "title-life",
                theme: "Life"
            }
        ];
        this.theme_now = this.props.theme_info;
        return {
            flag: true
        };
    },
    componentDidMount: function() {
        window.addEventListener("resize", this.onWindowResize);
    },
    componentDidUpdate: function(){
        this.theme_now = this.props.theme_info;
        //////////////////////////////Warning!!!////////////////////////////////////
        //Hack!!!!!(reason: Homepage is based on mixin "content_list"...)
        var elements = document.getElementsByClassName("home-article-sphr");
        for(var i=0; i<elements.length; i++){
            elements[i].style.backgroundColor = theme_color[this.props.theme_info];
        }
        //////////////////////////////Warning!!!////////////////////////////////////
    },
    onWindowResize: function(){
        this.setState({
            flag: !this.state.flag
        });
    },
    titleEffect: function(){
        var self = this;
        var title = this.cp_list.filter(function(item){
            return item.theme === self.props.theme_info ? item : null;
        })[0];
        var span = title === undefined ? undefined : $("#" + title.id).find("span");
        return velocityHelpers.registerEffect({
            defaultDuration: animation_default_duration,
            calls:[
                [
                    span === undefined ?
                    {
                        opacity: 0
                    }
                    :
                    {
                        opacity: 1,
                        backgroundColor: theme_color[title.theme],
                        marginLeft: span.offset().left - $("#home-main-title-bar").offset().left - 10,
                        width: span.width() + 20
                    },
                    1,
                    {
                        delay: 0,
                        easing: "easeOutQuint"
                    }
                ]
            ]
        });
    },
    changeThemeRequire: function(info){
        this.props.changeTheme(info, true);
    },
    changeThemeToDefault: function(){
        this.props.changeTheme(this.props.theme_default, false);
    },
    setDefaultTheme: function(info){
        this.props.setDefaultTheme(info);
    },
    render: function(){
        var self = this;
        return (
            <div id="home-main-title">
                <div id="title-list">
                    {
                        this.cp_list.map(function (item) {
                            return (
                                <li
                                    key={item.id}
                                    id={item.id}
                                    onMouseEnter={function(e){self.changeThemeRequire(item.theme);}}
                                    onMouseLeave={function(e){self.changeThemeToDefault();}}
                                    onClick={function(e){self.setDefaultTheme(item.theme);}}
                                >
                                    <Link to={"/category/" + item.theme}><span>{item.theme}</span></Link>
                                </li>
                            );
                        })
                    }
                </div>
                <div id="home-main-title-bar">
                    <VelocityComponent
                        key="velocity"
                        animation={this.titleEffect()}
                    >
                        <span id="title-bar"/>
                    </VelocityComponent>
                </div>
            </div>
        );
    }
});