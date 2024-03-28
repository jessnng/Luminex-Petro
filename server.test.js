const { authRegisterController } = require('/controllers/server');

const request = {
    body: {
        username: 'username1',
        password: 'password1',
    },
};

const respond = {
    status: jest.fn((x) => x),
    json: jest.fn((x) => x),
};

describe("POST /register", () => {

    describe("given a username and password", () => {

        test("should respond with a 400 status code when username exists", async () => {
            collection.findOne.mockImplementationOnce(() => ({
                id: 1,
                username: 'username',
                password: 'password',
            }));
            await authRegisterController(request, respond);
            expect(respond.status).toBe(400);

        })

        // should respond with a json obj containing the user id

        // test("should respond with a 200 status code", async () => {
        //     const respond = await request(server).post("/register").send({
        //         username: "username",
        //         password: "password"
        //     })
        //     expect(respond.statusCode).toBe(200)
        // })

        // should specify json in the content type header

    })

    describe("when the username and password is missing", () => {

        // should respond with a 400 status code

    })
})