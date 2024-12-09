//import {AtpAgent} from '@atproto/api'
import { agent } from './common'

enum RedirectError {
  NoRecord=0,
  InvalidLink=1
}

function error_string(error: RedirectError): string {
  const key = window.location.pathname.substring(1);
  if (error == RedirectError.NoRecord) {
    return "No record stored at "+key
  } else {
    return "Link stored at "+key+" is an invalid URL!"
  }
}


export default function(req:any, _router:any) {
  const output = document.querySelector<HTMLParagraphElement>('#output')!;
  output.innerHTML=''

  const handle = req.param.handle;
  const rkey = req.param.rkey;
  const link_key = handle + "/" + rkey;
  //const agent = new AtpAgent({service: 'https://bsky.social'});

  async function getLink() : Promise<URL> {
    let link;
    try {

      const resolved_handle = await agent.resolveHandle({
        handle: handle
      });

      const record = await agent.com.atproto.repo.getRecord({
        repo: resolved_handle.data.did,
        collection: 'blue.link2.redirect',
        rkey: rkey
      });
      link = record.data.value.link;
    } catch {
      throw RedirectError.NoRecord;
    }

    try {
      return new URL(link)
    } catch {
      throw RedirectError.InvalidLink
    }
  }

  async function main() {
    try {
      const link = await getLink();
      output.innerText = 'Resolved link\n' + link_key + ' ⟶ ' + link.href + '\nRedirecting...';
      setTimeout(() => {
        window.location = link;
      }, 1000);
      
    } catch (error: any) {
      output.innerText = error_string(error);
    }
  }

  main()

}
