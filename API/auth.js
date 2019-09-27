const auth = require("basic-auth");
const bcryptjs = require("bcryptjs");
const { User } = require("./models");

const authUser = async (req, res, next) => {
  try {
    let message = null;

    const credentials = auth(req);

    if (credentials) {
      const user = await User.findOne({
        where: { emailAddress: `${credentials.name}` }
      });

      if (user) {
        const authenticated = bcryptjs.compareSync(
          credentials.pass,
          user.password
        );

        if (authenticated) {
          console.log(
            `Authentication successful for username: ${user.firstName}`
          );

          const userDetails = user.toJSON();
          const { firstName, lastName, emailAddress, id } = user;
          req.currentUser = {
            firstName,
            lastName,
            emailAddress,
            id
          };
          // req.currentUser = user; //also work

        } else {
          message = `Authentication failed for username: ${user.emailAddress}`;
        }
      } else {
        message = `User not found for username: ${credentials.name}`;
      }
    } else {
      message = "Authentication header not found";
    }

    if (message) {
      console.warn(message);
      res
        .status(401)
        .json({ message: "Access Denied, please log in" });
    } else {
      next();
    }
  } catch (err) {
    console.warn(err);
  }
};

const asyncHandler = cb => {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (err) {
      res.render("error", { error: err });
    }
  };
};

module.exports = authUser;
