var _ = require("lodash");
var React = require("react/addons");

var Config = require("editor/config");

var TerminalsActions = require("editor/actions/TerminalsActions");
var TerminalsStore = require("editor/stores/TerminalsStore");

var Terminal = require("./Terminal");

var WatchStoreMixin = require("editor/mixins/WatchStore");

var TerminalsBox = React.createClass({
  mixins: [WatchStoreMixin(TerminalsStore)],

  getFluxState: function() {
    return {
      terminals: TerminalsStore.getAll()
    };
  },

  renderTabHeaders: function() {
    return _.map(this.state.terminals, function(terminal, id) {
      var tabClasses = React.addons.classSet({
        "active": terminal.current
      });

      return <li key={"tab_" + id} className={tabClasses}>
        <a href="#" onClick={this.selectTerminal.bind(this, terminal)} className={tabClasses}>
          <span>{"Terminal " + id}</span>
          <button type="button" className="close" onClick={this.closeTerminal.bind(this, terminal)}>
            <span aria-hidden="true">&times;</span>
            <span className="sr-only">
              Close
            </span>
          </button>
        </a>
      </li>;
    }, this);
  },

  renderTerminals: function() {
    return _.map(this.state.terminals, function(terminal) {
      var classes = React.addons.classSet({
        "tab-pane": true,
        "fade active in": terminal.current,
        "terminal": true
      });

      return (
          <div className={classes} key={terminal.id}>
            <Terminal terminal={terminal} className={classes} />
          </div>
      );
    });
  },

  render: function() {
    return (
      <div className="terminals-box">
        <ul className="nav nav-tabs" role="tablist">
          {this.renderTabHeaders()}
          <li key="tab_create">
            <a onClick={this.createTerminal}>Create terminal</a>
          </li>
        </ul>
        <div className="tab-content max-height">
          {this.renderTerminals()}
        </div>
      </div>
    );
  },

  selectTerminal: function(terminal, e) {
    e.preventDefault();
    e.stopPropagation();
    TerminalsActions.selectTerminal(terminal);
  },

  createTerminal: function(e) {
    e.preventDefault();
    e.stopPropagation();
    TerminalsActions.createTerminal(Config.terminal);
  },

  closeTerminal: function(terminal, e) {
    e.preventDefault();
    e.stopPropagation();
    TerminalsActions.closeTerminal(terminal);
  },
});

module.exports = TerminalsBox;
