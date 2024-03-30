const express = require('express')

const data = [
    {
        "gallonsRequested": 20,
        "deliveryAddress": '1234 Washington Blvd, Houston, TX',
        "deliveryDate": '2023-12-01',
        "suggestedPrice": 2.50,
        "amountDue": 50
    },

    {
        "gallonsRequested": 20,
        "deliveryAddress": '1234 Washington Blvd, Houston, TX',
        "deliveryDate": '2024-12-27',
        "suggestedPrice": 2.99,
        "amountDue": 59.80
    },

    {
        "gallonsRequested": 15,
        "deliveryAddress": '12345 Hazel Rd, Houston, TX',
        "deliveryDate": '2024-01-15',
        "suggestedPrice": 3.15,
        "amountDue": 47.25
    }
]

function populateTable(data) {
    const table = document.querySelector("#quoteHistoryTable tbody");

    data.forEach( data => {
        let row = document.createElement('tr');
        row.innerHTML = `
        <td>${data.gallonsRequested}</td>
        <td>${data.deliveryAddress}</td>
        <td>${data.deliveryDate}</td>
        <td>${data.suggestedPrice}</td>
        <td>${data.amountDue}</td>
        `;
        table.append(row);
    });
}
