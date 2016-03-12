var initialState = require('../initialstate');

module.exports = function(state, action) {
    switch(action.type){
        case "UPDATE_STOCK_INFORMATION":
            return action.stockInformation;
        default:
            return state || initialState().stockInformation;
    }
};
