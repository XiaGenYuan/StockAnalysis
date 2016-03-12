var Redux = require('redux');
var initialState = require('./initialstate');
var thunk = require('redux-thunk');
var stockInformationReducer = require('./reducers/stockinformation');
var stockIDs = require('./reducers/stockname');
var stockCompare = require('./reducers/stockcompare');


var rootReducer = Redux.combineReducers({
    stockInformation: stockInformationReducer,
    stockIDs: stockIDs,
    stockCompare: stockCompare
});

module.exports = Redux.createStore(rootReducer, initialState());
