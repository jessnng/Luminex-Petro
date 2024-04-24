// Import the module containing the calculateFuelQuote function
const { calculateFuelQuote } = require('../controllers/pricingModule.js');
const dbManager = require('../controllers/databaseManager');

jest.mock('../controllers/databaseManager');

// Test suite for pricing module
describe('Pricing Module - calculateFuelQuote', () => {
  let client;

  beforeEach(() => {
    client = {
      db: jest.fn().mockReturnThis(),
      collection: jest.fn().mockReturnThis(),
      findOne: jest.fn()
    };

    // Mocking getClient function
    dbManager.getClient.mockReturnValue(client);
  });

  // Test case: Basic test with standard values
  test('Standard calculation with 500 gallons, location factor 0.05, rate history factor 0.02', () => {
    client.findOne.mockResolvedValueOnce({});
    const result = calculateFuelQuote(500, 0.05, 0.02);
    expect(result.suggestedPricePerGallon).toBe('1.540');
    expect(result.totalAmountDue).toBe('770.00'); // 500 * 1.54
  });

  // Test case: Larger order with 1000 gallons
  test('Larger order with 1000 gallons, location factor 0.08, rate history factor 0.03', () => {
    client.findOne.mockResolvedValueOnce({});
    const result = calculateFuelQuote(1000, 0.08, 0.03);
    expect(result.suggestedPricePerGallon).toBe('1.550');
    expect(result.totalAmountDue).toBe('1550.00'); // 1000 * 1.55
  });

  // Test case: Different location factor
  test('Calculation with different location factor (0.1)', () => {
    client.findOne.mockResolvedValueOnce({});
    const result = calculateFuelQuote(750, 0.1, 0.02);
    expect(result.suggestedPricePerGallon).toBe('1.570');
    expect(result.totalAmountDue).toBe('1177.50'); // 750 * 1.57
  });

  // Test case: High rate history factor
  test('High rate history factor with 400 gallons, location factor 0.04, rate history factor 0.05', () => {
    client.findOne.mockResolvedValueOnce({});
    const result = calculateFuelQuote(400, 0.04, 0.05);
    expect(result.suggestedPricePerGallon).toBe('1.495');
    expect(result.totalAmountDue).toBe('598.00'); // 400 * 1.495
  });

  // Test case: Edge case with high gallons requested
  test('Edge case with high gallons requested (2000)', () => {
    client.findOne.mockResolvedValueOnce({});
    const result = calculateFuelQuote(2000, 0.05, 0.03);
    expect(result.suggestedPricePerGallon).toBe('1.530');
    expect(result.totalAmountDue).toBe('3060.00'); // 2000 * 1.53
  });

  // Test case: Edge case with low rate history factor
  test('Edge case with low rate history factor (0.01)', () => {
    client.findOne.mockResolvedValueOnce({});
    const result = calculateFuelQuote(500, 0.06, 0.01);
    expect(result.suggestedPricePerGallon).toBe('1.560');
    expect(result.totalAmountDue).toBe('780.00'); // 500 * 1.56
  });
});
