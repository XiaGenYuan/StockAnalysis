module.exports = {
    updateStockInformation: function(stockInformation) {
        return {
            type: "UPDATE_STOCK_INFORMATION",
            stockInformation: stockInformation
        };
    },
    updateIDs: function(stockIDs) {
        return {
            type: "UPDATE_STOCK_IDS",
            stockIDs: stockIDs
        };
    },
    updateStockCompare: function(stockCompare) {
        return {
            type: "UPDATE_STOCK_COMPARE",
            stockCompare: stockCompare
        };
    }
};
