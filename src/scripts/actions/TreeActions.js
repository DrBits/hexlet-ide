/* global require module */

var AppDispatcher = require("dispatcher/AppDispatcher");
var CodexConstants = require("constants/CodexConstants");
var ActionTypes = CodexConstants.ActionTypes;

var TreeActions = {
    toggleFolderState: function(ancestry) {
        "use strict";
        AppDispatcher.dispatch({
            actionType: ActionTypes.TREE_TOGGLE_FOLDER_STATE,
            ancestry: ancestry
        });
    },

    openFile: function(item) {
        "use strict";
        AppDispatcher.dispatch({
            actionType: ActionTypes.TREE_OPEN_FILE,
            item: item
        });
    }
};

module.exports = TreeActions;
