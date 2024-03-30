
const FuelPricing = {
    basePricePerGallon: 3.50, // example base price for fuel
    
    // calculate total price based on the number of gallons
    calculateTotal: function (gallons) {
        return this.basePricePerGallon * gallons;
    }
};

module.exports = FuelPricing;