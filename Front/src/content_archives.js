'use strict';
/**
 * Created by dtysky on 16/2/3.
 */

var React = require('react/addons');
var ContentList = require('./content_list');

require('./theme/css/sky.css');

module.exports = React.createClass({
    render: function(){
        return (
            <ContentList
                type="archives"
                name="all"
                index={this.props.params.index}
                handleHead={this.props.handleHead}
            />
        );
    }
});