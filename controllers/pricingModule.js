function getPricePerGallon() {
    const basePricePerGallon = 2.5;
    return basePricePerGallon;
}
function FuelPricing(gallons, basePricePerGallon) {

    // calculate total price based on the number of gallons
    return basePricePerGallon * gallons;
}

module.exports = {
    FuelPricing,
    getPricePerGallon
}