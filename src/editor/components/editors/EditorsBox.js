/** @jsx React.DOM */

var _ = require("lodash");
// var Immutable = require("immutable");
var React = require("react/addons");
// var ReactPropTypes = React.PropTypes;
var key = require("keymaster");

var WatchStoreMixin = require("editor/mixins/WatchStore");

var Editor = require("./Editor");

var EditorsStore = require("editor/stores/EditorsStore");
var EditorsActions = require("editor/actions/EditorsActions");
var ModalActions = require("editor/actions/ModalActions");

var EditorsBox = React.createClass({
  // propTypes: {
  // tabsData: React.PropTypes.renderable.isRequired
  // defaultCollapsed: React.PropTypes.bool,
  // },
  mixins: [ WatchStoreMixin(EditorsStore) ],

  getFluxState: function() {
    return {
      editors: EditorsStore.getAll(),
      current: EditorsStore.getCurrent()
    }
  },

  handleChangeEditorValue: function(current, content) {
    EditorsActions.edit(current, content);
  },

  handleSaveFile: function() {
    EditorsActions.save(this.state.current);
  },

  selectEditor: function(editor, e) {
    EditorsActions.makeCurrent(editor);
  },

  handleCloseTab: function(e) {
    var current = this.state.current;
    if (this.state.current.dirty) {
      ModalActions.showModal({
        title: "Close unsaved tab",
        onApply: function() {
          EditorsActions.closeEditor(current);
        },
        content: function() {
          return <p>are you sure? (unsaved data will be lost)</p>;
        }
      });
    } else {
      EditorsActions.closeEditor(current);
    }
    // TabsActions.flushTabContent(this.state.current.id, this.state.value);
  },

  render: function() {
    var cx = React.addons.classSet;

    var editors = this.state.editors;
    var current = this.state.current;

    var items = editors.map(function(editor) {
      var classes = cx({
        "active": editor.current,
      });

      return (<li key={"editor_" + editor.id} className={classes}>
        <a href="#">
          <span onDoubleClick={this.handleCloseTab.bind(this, editor)} onClick={this.selectEditor.bind(this, editor)}>
            {editor.name}
            {editor.dirty ? "*" : ""}
          </span>
          <span className="glyphicon glyphicon-remove" onClick={this.handleCloseTab.bind(this, editor)}></span>
        </a>
      </li>);
    }, this);

    return (
      <div className="editors-box">
          <ul className="nav nav-tabs" role="tablist">
            {items}
          </ul>
          <div className="tab-content">
            {editors.map(function(editor) {
              var mode = this.getEditorMode(editor.name);
              var classes = cx({
                "tab-pane": true,
                "fade active in": editor.current
              });

              return (
                <div className={classes} key={editor.id}>
                  <Editor mode={mode}
                    focus={editor.current}
                    onChangeValue={this.handleChangeEditorValue.bind(this, editor)}
                    initContent={editor.content} />
                </div>
                );
            }, this)}
          </div>
        </div>
    );
  },

  getEditorMode: function(fileName) {
    var modes = {
      "js": "javascript",
      "jade": "jade"
    };

    var extension = _.last(fileName.split("."));
    var mode = modes[extension];
    if (!mode) {
      console.warn("Mode for file: ",  fileName, " is not defined");
      return "javascript";
    }

    return mode;
  },

  componentWillUpdate: function(nextProps, nextState) {
    var $this = this;

    if (nextState.current === undefined) {
      key.unbind("ctrl+s");
    } else {
      key("ctrl+s", function(){ $this.handleSaveFile(); return false });
    }
  }
});

module.exports = EditorsBox;
