import { AtpAgent } from "@atproto/api";

export default new AtpAgent({
  service: 'https://bsky.social',
  persistSession: (_evt, session) => {
    if (session) {
      window.localStorage.setItem('session', JSON.stringify(session));
    } else {
      window.localStorage.removeItem('session');
    }
  }
})

