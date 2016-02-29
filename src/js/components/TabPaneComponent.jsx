import classNames from "classnames";
import React from "react/addons";

var TabPaneComponent = React.createClass({
  displayName: "TabPaneComponent",

  propTypes: {
    children: React.PropTypes.node,
    className: React.PropTypes.string,
    isActive: React.PropTypes.bool,
    onActivate: React.PropTypes.func
  },

  componentDidUpdate: function (prevProps) {
    if (!prevProps.isActive && this.props.isActive) {
      this.props.onActivate();
    }
  },

  getDefaultProps: function () {
    return {
      isActive: false,
      onActivate: function () {}
    };
  },

  render: function () {
    if (!this.props.isActive) {
      return null;
    }

    var classSet = classNames("tab-pane active", this.props.className);

    return (
      <div className={classSet}>
        {this.props.children}
      </div>
    );
  }
});

export default TabPaneComponent;
