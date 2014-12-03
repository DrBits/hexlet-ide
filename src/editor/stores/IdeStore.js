/* global require module */
var AppDispatcher = require("editor/dispatcher/AppDispatcher");
var BaseStore = require("./BaseStore");
var ActionTypes = require("editor/constants/IdeConstants").ActionTypes;

var state = {
  loaded: false,
  fullScreen: false
};

var IdeStore = BaseStore.extend({
  getState: function() {
    "use strict";
    return state;
  }
});

AppDispatcher.registerHandler(ActionTypes.IDE_LOADED, function() {
  "use strict";

  state.loaded = true;
  IdeStore.emitChange();
});

AppDispatcher.registerHandler(ActionTypes.IDE_TOGGLE_FULL_SCREEN, function() {
  "use strict";

  state.fullScreen = !state.fullScreen;
  IdeStore.emitChange();
});

module.exports = IdeStore;
