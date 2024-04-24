const getRateHistoryFactor = async (client, username) => {

    if (!username || typeof username !== 'string') {
        res.status(400).json({ message: 'Invalid or missing username' }); // Modified to return error response
        return;
    }

    try {
        const database = client.db("appdb");
        const collection = database.collection("fuel-quotes");

        // Fetch user's quote history
        const quoteHistory = await collection.find({ username: username }).toArray();

        const rateHistoryFactor = (quoteHistory.length === 0) ? 0.00 : 0.01;

        return rateHistoryFactor; // Respond with the calculated factor
    } catch (error) {
        console.error("Error retrieving rate history factor:", error);
        throw new Error('Error retrieving rate history factor'); // Error handling
    }
};

module.exports = { getRateHistoryFactor };
