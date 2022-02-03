import dotenv from "dotenv";
import openid from "express-openid-connect";
import createSession from "./createSession.js";
import { createAppServer } from "@stanlemon/server";

dotenv.config();

const { auth, requiresAuth } = openid;

const port = process.env.PORT || 3000;

const app = createAppServer({ port });

// TODO. This should be derived from a host, protocol and the previously designated port
const baseURL = process.env.BASE_URL || `http://localhost:${port}`;

app.use(
  auth({
    baseURL,
    authRequired: true,
    auth0Logout: true,
  })
);

// Find the index route we get for free from the server component
const indexRoute = app._router.stack.filter((r) => r.route?.path === "/");
// Remove that route from the stack in express
app._router.stack = app._router.stack.filter((r) => r.route?.path !== "/");
// Put that route back, but add an auth check
app.get("/", requiresAuth(), (req, res, next) => indexRoute.handle);

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
