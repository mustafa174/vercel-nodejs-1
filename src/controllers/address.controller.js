import * as Yup from "yup";
import Address from "../models/Address";
import { BadRequestError, ValidationError } from "../utils/ApiError";

let addressController = {
  add: async (req, res, next) => {
    try {
      const schema = Yup.object().shape({
        city: Yup.string().required(),
        address: Yup.string().required(),
        postal_code: Yup.string().required(),
        country: Yup.string().required(),
      });

      if (!(await schema.isValid(req.body, { abortEarly: false }))) throw new ValidationError();

      const addressExists = await Address.findOne({
        where: { ...req.body },
      });

      if (addressExists) throw new BadRequestError("this address exists already");

      const address = await Address.create(req.body);

      return res.status(200).json(address);
    } catch (error) {
      next(error);
    }
  },
};

export default addressController;
