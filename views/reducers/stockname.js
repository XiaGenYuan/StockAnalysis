var initialState = require('../initialstate');

module.exports = function(state, action) {
    switch(action.type){
        case "UPDATE_STOCK_IDS":
            return action.stockIDs;
        default:
            return state || initialState().stockIDs;
    }
};
