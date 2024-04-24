const { calculateFuelQuote } = require('../controllers/pricingModule'); // Update with your module path

describe('calculateFuelQuote', () => {
  test('calculates suggested price per gallon and total amount due for a small order', async () => {
    const result = await calculateFuelQuote(500, 0.02, 0.0); // Smaller order

    expect(result.suggestedPricePerGallon).toBeCloseTo(1.55, 2); // Ensure accuracy
    expect(result.totalAmountDue).toBe('775.00'); // Check calculated amount
  });

  test('calculates suggested price per gallon and total amount due for a large order', async () => {
    const result = await calculateFuelQuote(1500, 0.04, 0.1); // Larger order

    expect(result.suggestedPricePerGallon).toBeCloseTo(1.64, 2); // 1.64 rounded to 2 decimals
    expect(result.totalAmountDue).toBe('2460.00'); // Check total
  });

  test('handles errors during database connection', async () => {
    const dbManager = require('./databaseManager');

    // Simulate a connection error
    dbManager.connect = jest.fn().mockRejectedValue(new Error('Connection failed'));

    try {
      await calculateFuelQuote(600, 0.02, 0.05); // Trigger the function
      fail('Should have thrown an error'); // Force the test to fail if no error is thrown
    } catch (error) {
      expect(error.message).toBe('Connection failed'); // Check error message
    }
  });
});
