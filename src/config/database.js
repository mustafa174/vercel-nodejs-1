require("dotenv/config");

module.exports = {
  dialect: postgres,
  host: pg-89258fa-mustafa-3020.c.aivencloud.com,
  username: avnadmin,
  password: AVNS_39S3BW_qe2LB0xWT3vG,
  database: glambeautyData,
  port:glambeautyData,
  DB_SSL:true,
  define: {
    timestamps: true,
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Add this for rejecting unauthorized certificates
    },
  },
};
