const popupProfileController = async (client, req, res) => {
    try {
        console.log(req.body);
        const { fullname, address1, address2, city, state, zipcode, username } = req.body

        const db = client.db("appdb");
        const collection = db.collection("users");
        
        let updateFields = {};

        if (fullname) updateFields.fullname = fullname;

        const addressUpdate = {};
        if (address1) addressUpdate["address.address1"] = address1;
        if (address2) addressUpdate["address.address2"] = address2;
        if (city) addressUpdate["address.city"] = city;
        if (state) addressUpdate["address.state"] = state;
        if (zipcode) addressUpdate["address.zipcode"] = zipcode;

        // Set the address update object in the main updateFields object
        updateFields = { ...updateFields, ...addressUpdate };

        await collection.updateOne({ username: username }, { $set: updateFields });

        res.status(200).json({ message: "User profile updated successfully" });
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ error: "An unexpected error occurred while updating user profile" });
    }
};

module.exports = { popupProfileController };
