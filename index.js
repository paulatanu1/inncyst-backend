const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const cors = require("cors");
const errorHandler = require("./middlewares/error.middleware");
const connectDB = require("./config/db");
const colors = require("colors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const morgan = require("morgan");
const path = require('path');
// const users = require("./routes/user.router");

const orgUser = require("./modules/organization/org-user/org-user.router");
const lab = require("./modules/lab/lab/lab.router");
const labUser = require("./modules/lab/lab-user/lab-user.router");
const access = require("./modules/lab/access/access.router");

const labProfile = require("./modules/organization/profile/organization.router");
const facilities = require("./modules/lab/facilities/facility.router");
const inventory = require("./modules/lab/inventory/inventory.router");
const billing = require("./modules/lab/billing/billing.router");
const roles = require("./modules/lab/roles/roles.router");

const getMe = require("./modules/common/router/getMe.router");

const testRequest = require("./modules/lab/lims/test-request/test-request.router");
const form = require("./modules/lab/form/form.router");
const customer = require("./modules/lab/customer/customer.router");
const authRouter = require("./modules/auth/auth.router");
const industryRouter = require("./modules/industry/industry.router");
const manufacturerRouter = require('./modules/manufacturer/manufacturer.router');
const intranshipRouter = require("./modules/intranship/intranship.router");
const studentRouter = require("./modules/student/student.router");
const contactRouter = require("./modules/common/contact/contact.router");

connectDB();
const app = express();
const port = process.env.PORT || 5500;

app.use(cors());
app.use(fileUpload());
app.use(cookieParser());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use(morgan("tiny"));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/email-template', express.static(path.join(__dirname, 'public/templates')));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type,Authorization,X-Custom-Header"
  );
  next();
});

// app.use("/api/users", users);
// app.use("/api/mail-svc", mail);

// app.use("/api/organization/profile", labProfile);
// app.use("/api/organization/manager", labManager);
// app.use("/api/organization/facilities", facilities);
app.use("/api/auth", authRouter);
app.use("/api/industry", industryRouter);
app.use("/api/manufacturer", manufacturerRouter);
app.use("/api/job", intranshipRouter);
app.use("/api/student/", studentRouter);
app.use("/api/contact", contactRouter);

app.use("/api/lab/inventory", inventory);
app.use("/api/lab/billing", billing);
app.use("/api/lab/roles", roles);

app.use("/api/", getMe);
app.use("/api/organization/user", orgUser);
app.use("/api/lab/", lab);
app.use("/api/lab/user/", labUser);
app.use("/api/lab/access/", access);

app.use("/api/lab/lims/", testRequest);
app.use("/api/lab/form", form);
app.use("/api/lab/customer", customer);

app.use(errorHandler);

const server = app.listen(port, () =>
  console.log(`Server running at port ${port}`)
);
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // close server & exit
  server.close(() => process.exit(1));
});
