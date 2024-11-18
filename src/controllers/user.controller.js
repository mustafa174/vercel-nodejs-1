import * as Yup from "yup";
import Address from "../models/Address";
import User from "../models/User";
import { BadRequestError, UnauthorizedError, ValidationError, sendSuccessResponse } from "../utils/ApiError";
import JwtService from "../services/jwt.service";

//Yup is a JavaScript schema builder for value parsing and validation.

let userController = {
  add: async (req, res, next) => {
    try {
      const { email, phone_number, address } = req.body;

      const schema = Yup.object().shape({
        name: Yup.string().required(),
        email: Yup.string().email().required(),
        password: Yup.string().required().min(3),
        phone_number: Yup.number().required().min(6),
      });

      if (!(await schema.validate(req.body, { abortEarly: false }))) {
        throw new ValidationError("Schema not matched");
      }

      const userExists = await User.findOne({ where: { email } });
      const userWithPhoneNumber = await User.findOne({ where: { phone_number } });

      if (userWithPhoneNumber) throw new BadRequestError("This phone number is already registered!");
      if (userExists) throw new BadRequestError("This email is already registered!");

      // Check if the address exists or create it
      let addressRecord = await Address.findOne({
        where: {
          city: address.city,
          address: address.address,
          country: address.country,
          postal_code: address.postal_code,
        },
      });

      if (!addressRecord) {
        // Create a new address if it doesn't exist
        addressRecord = await Address.create(address);
      }

      // Create the user
      const user = await User.create(req.body);

      // Associate the user with the address in the junction table
      await user.addAddress(addressRecord);
      console.log("INSTANCEC", user.addAddress);
      console.log(typeof user.addAddress);
      sendSuccessResponse(res, user, "User created successfully");
    } catch (error) {
      console.log("ERROR > ", error);
      next(error);
    }
  },

  addAddress: async (req, res, next) => {
    try {
      const { body, userId } = req;

      const schema = Yup.object().shape({
        city: Yup.string().required(),
        state: Yup.string().required(),
        neighborhood: Yup.string().required(),
        country: Yup.string().required(),
      });

      if (!(await schema.isValid(body.address))) throw new ValidationError();

      const user = await User.findByPk(userId);

      let address = await Address.findOne({
        where: { ...body.address },
      });

      if (!address) {
        address = await Address.create(body.address);
      }

      await user.addAddress(address);

      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },

  get: async (req, res, next) => {
    try {
      const users = await User.findAll({
        attributes: { exclude: ["password", "password_hash"] },
        include: [
          {
            model: Address,
            through: { attributes: [] }, // Exclude the junction table attributes
            attributes: ["city", "country", "postal_code", "address"], // Specify address fields to include
          },
        ],
        // Exclude the password field
      });

      sendSuccessResponse(res, users, "success!");
    } catch (error) {
      next(error);
    }
  },

  find: async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id, {
        attributes: { exclude: ["password", "password_hash"] }, // Exclude the password field
      });

      if (!user) throw new BadRequestError();
      sendSuccessResponse(res, user, "success");
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const schema = Yup.object().shape({
        name: Yup.string(),
        email: Yup.string().email(),
        oldPassword: Yup.string().min(6),
        password: Yup.string()
          .min(6)
          .when("oldPassword", (oldPassword, field) => {
            if (oldPassword) {
              return field.required();
            } else {
              return field;
            }
          }),
        confirmPassword: Yup.string().when("password", (password, field) => {
          if (password) {
            return field.required().oneOf([Yup.ref("password")]);
          } else {
            return field;
          }
        }),
      });

      if (!(await schema.validate(req.body, { abortEarly: false }))) throw new ValidationError();

      const { email, oldPassword } = req.body;

      const user = await User.findByPk(req.userId);

      if (email) {
        const userExists = await User.findOne({
          where: { email },
        });
        console.log("userExists", userExists);
        if (!userExists) throw new BadRequestError("User not found", 404);
      }

      if (oldPassword && !(await user.checkPassword(oldPassword))) throw new UnauthorizedError();

      const newUser = await user.update(req.body);
      sendSuccessResponse(res, newUser, "User updated successfully");
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) throw new BadRequestError();

      user.destroy();

      return res.status(200).json({ msg: "Deleted" });
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const schema = Yup.object().shape({
        email: Yup.string().email().required(),
        password: Yup.string().required(),
      });

      if (!(await schema.isValid(req.body))) throw new ValidationError();

      let { email, password } = req.body;
      const user = await User.findOne({
        where: { email },
      });

      if (!user) throw new BadRequestError("User not found!", 404);

      if (!(await user.checkPassword(password))) throw new UnauthorizedError("Invalid credentials", 401);

      const token = JwtService.jwtSign(user.id);

      return res.status(200).json({ user, token });
    } catch (error) {
      next(error);
    }
  },

  logout: async (req, res, next) => {
    try {
      JwtService.jwtBlacklistToken(JwtService.jwtGetToken(req));

      res.status(200).json({ msg: "Authorized" });
    } catch (error) {
      next(error);
    }
  },
};

export default userController;
