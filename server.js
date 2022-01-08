import express from "express";
import dotenv from "dotenv";
import openid from "express-openid-connect";
import createSession from "./createSession.js";

dotenv.config();

const { auth, requiresAuth } = openid;

const app = express();
const port = process.env.PORT || 3000;
// TODO. This should be derived from a host, protocol and the previously designated port
const baseURL = process.env.BASE_URL || `http://localhost:${port}`;

app.use(
  auth({
    baseURL,
    authRequired: true,
    auth0Logout: true,
    routes: {
      // Disable default login route so we can do special handling when in dev
      login: false,
    },
  })
);

app.get("/dev", (req, res) => {
  res.redirect("http://localhost:8080/");
});

app.get("/ping", (req, res) => {
  res.json({
    isAuthenticated: req.oidc.isAuthenticated(),
  });
});

app.get("/login", (req, res) => {
  const opts = {};
  if (req.query && req.query.dev && req.query.dev === "1") {
    opts.returnTo = "http://localhost:3001/dev";
  }
  return res.oidc.login(opts);
});

app.get("/session", requiresAuth(), async (req, res, next) => {
  const session = await createSession(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET,
    req.oidc.user.nickname
  );

  res.json({
    ...session,
    user: req.oidc.user,
  });
});

app.use(express.static("./dist"));

app.listen(port, () => {
  console.log(`Listening at ${baseURL}`);
});
