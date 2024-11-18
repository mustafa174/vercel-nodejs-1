import dotenv from "dotenv";
import expressService from "./services/express.service";
import sequelizeService from "./services/sequelize.service";
import awsService from "./services/aws.service";
import cloudinaryService from "./services/cloudinary.service";
dotenv.config();

// const services = [expressService, awsService, sequelizeService];
const services = [expressService, sequelizeService, cloudinaryService];

(async () => {
  try {
    for (const service of services) {
      await service.init();
    }
    console.log("Server initialized.");
    //PUT ADITIONAL CODE HERE.
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();
