// @ts-nocheck
import SPARouter from "@kodnificent/sparouter"; // if you are hosting locally


import home from './home';
import account from './account';
import redirect from "./redirect";

const options = {
historyMode : true // set this to true if you use the HTML5 history mode API
}
const router = new SPARouter(options);

router.get("/", home).setName("home");
router.get("/{handle}", account).setName("account");
router.get("/{handle}/{rkey}", redirect).setName("redirect");

export default router;
