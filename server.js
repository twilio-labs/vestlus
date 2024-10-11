import dotenv from "dotenv";
import createSession from "./createSession.js";
import {
  createAppServer,
  LowDBUserDao,
  createLowDb,
} from "@stanlemon/server-with-auth";
import Joi from "joi";

dotenv.config();

const port = process.env.PORT || 3000;

const schema = Joi.object({
  name: Joi.string().required().label("Name"),
  email: Joi.string().email().required().label("Email"),
  username: Joi.string().required().label("Username"),
  password: Joi.string().required().min(8).max(64).label("Password"),
});

const db = createLowDb();
const dao = new LowDBUserDao(db);

const app = createAppServer({
  port,
  webpack: "http://localhost:8080",
  secure: ["/api/"],
  schema,
  dao,
});

app.get("/api/session", async (req, res, next) => {
  const user = await dao.getUserByUsername(req.user.username);

  const session = await createSession(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET,
    user.username
  );

  res.json({
    ...session,
  });
});
