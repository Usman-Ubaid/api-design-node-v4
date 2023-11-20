const user = require("../user");

describe(" user handler functions", () => {
  it("should create a new User", async () => {
    const req = {
      body: { username: "usman", password: "cookies" },
    };
    const res = {
      json({ token }) {
        expect(token).toBeTruthy();
      },
    };

    await user.createNewUser(req, res, () => {});
  });
});
