var initialState = require('../initialstate');

module.exports = function(state, action) {
    switch(action.type){
        case "UPDATE_STOCK_COMPARE":
            return action.stockCompare;
        default:
            return state || initialState().stockCompare;
    }
};
