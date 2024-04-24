const dbManager = require('./databaseManager');

const currentPricePerGallon = 1.50; // Base price
const companyProfitFactor = 0.10; // Constant company profit factor

async function calculateFuelQuote(gallonsRequested, locationFactor, rateHistoryFactor) {
    const client = dbManager.getClient();
    await dbManager.connect();

    // Determine the gallons requested factor based on the number of gallons
    const gallonsRequestedFactor = gallonsRequested >= 1000 ? 0.02 : 0.03;

    // Convert to numbers to ensure proper calculation
    locationFactor = parseFloat(locationFactor);
    rateHistoryFactor = parseFloat(rateHistoryFactor);

    // Calculate the margin using the corrected formula
    const margin = currentPricePerGallon * (locationFactor - rateHistoryFactor + gallonsRequestedFactor + companyProfitFactor);

    // Calculate the suggested price per gallon
    const suggestedPricePerGallon = currentPricePerGallon + margin;

    // Calculate the total amount due based on gallons requested
    const totalAmountDue = gallonsRequested * suggestedPricePerGallon;
    
    const formattedSuggestedPricePerGallon = `$${suggestedPricePerGallon.toFixed(3)}`;
    const formattedTotalAmountDue = `$${totalAmountDue.toFixed(2)}`;

    return {
        suggestedPricePerGallon: suggestedPricePerGallon.toFixed(3), // Fix to 3 decimal places
        totalAmountDue: totalAmountDue.toFixed(2), // Fix to 2 decimal places
    };
}

// Export the function for external use
module.exports = {calculateFuelQuote};
