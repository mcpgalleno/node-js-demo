const users = require("../routes/users.route");
const admins = require("../routes/admins.route");
const roles = require("../routes/roles.route");
const specializations = require("../routes/specializations.route");
const appointments = require("../routes/appointments.route");
const paymentMethods = require("../routes/payment-methods.route");
const authentications = require("../routes/authentications.route");

module.exports = function (app) {
  app.use("/api/auth", authentications)
  app.use("/api/users", users);
  app.use("/api/admins", admins);
  app.use("/api/roles", roles);
  app.use("/api/specializations", specializations);
  app.use("/api/appointments", appointments);
  app.use("/api/payment-methods", paymentMethods);
};