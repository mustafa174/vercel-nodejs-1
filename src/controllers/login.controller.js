import * as Yup from "yup";
import User from "../models/User";
import JwtService from "../services/jwt.service";
import { BadRequestError, UnauthorizedError, ValidationError } from "../utils/ApiError";

let loginController = {
  login: async (req, res, next) => {
    console.log("LOGIN ", req, res);
    try {
      const schema = Yup.object().shape({
        email: Yup.string().email().required(),
        password: Yup.string().required(),
      });

      if (!(await schema.isValid(req.body))) throw new ValidationError();

      let { email, password } = req.body;

      const user = await User.findOne({
        where: { email },
        attributes: { exclude: ["password_hash"] }, // Exclude password_hash from the query result
      });

      if (!user) throw new BadRequestError();

      if (!(await user.checkPassword(password))) throw new UnauthorizedError();

      const token = JwtService.jwtSign(user.id);
      // Exclude sensitive fields from user object
      const { password: _, ...safeUser } = user.toJSON(); // Use `toJSON` to work with plain object

      // Send response
      return res.status(200).json({ user: safeUser, token });
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

export default loginController;
