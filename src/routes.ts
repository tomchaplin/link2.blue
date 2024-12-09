// @ts-nocheck
import SPARouter from "@kodnificent/sparouter"; // if you are hosting locally


import home from './home';
import account from './account';
import redirect from "./redirect";

const options = {
  historyMode: true // set this to true if you use the HTML5 history mode API
}
const router = new SPARouter(options);

// We do all this weirdness to allow code-splitting at the route level.
// We use @atcute/client on the redirect route to reduce bundle size there.
// TODO: Maybe swap to @atcute/client on home and account?

router.get("/", (req, router) => {
  (async function() {
    const module = await import('./home');
    module.default(req, router)
  })()
}).setName("home");
router.get("/{handle}",
  (req, router) => {
    (async function() {
      const module = await import('./account');
      module.default(req, router)
    })()
  }
).setName("account");
router.get("/{handle}/{rkey}",
  (req, router) => {
    (async function() {
      const module = await import('./redirect');
      module.default(req, router)
    })()
  }
).setName("redirect");

export default router;
