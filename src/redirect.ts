//import {AtpAgent} from '@atproto/api'
import { agent } from './common'

enum RedirectError {
  NoRecord = 0,
  InvalidLink = 1
}

function error_string(error: RedirectError): string {
  const key = window.location.pathname.substring(1);
  if (error == mailRedirectError.NoRecord) {
    return "No record stored at " + key
  } else {
    return "Link stored at " + key + " is an invalid URL!"
  }
}


export default function(req: any, _router: any) {
  const output = document.querySelector<HTMLParagraphElement>('#output')!;
  output.innerHTML = ''

  const handle = req.param.handle;
  const rkey = req.param.rkey;
  const link_key = handle + "/" + rkey;
  //const agent = new AtpAgent({service: 'https://bsky.social'});

  async function getLink(): Promise<URL> {
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

  function build_key_span(key) {
    const key_span = document.createElement('span');
    key_span.innerText = key;
    key_span.className = 'with_border';
    return key_span;
  }
  
  function showSuccess(key, href) {
    const message = document.createElement('div');
    message.classList.add('redirect');

    const key_span = build_key_span(key);
    message.appendChild(key_span);

    const arrow_span = document.createElement('span');
    arrow_span.innerText = '⟶';
    message.appendChild(arrow_span);

    const link_a = document.createElement('a');
    link_a.href = href;
    link_a.innerText = href;
    link_a.className = 'with_border';
    message.appendChild(link_a);

    output.appendChild(message);
  }

  function showFailure(key, error) {
      const message = document.createElement('p');
      message.classList.add('redirect');
      message.classList.add('error_msg');
      message.classList.add('centered');

      const key_span = build_key_span(key);

      if (error == RedirectError.NoRecord) {
        message.innerHTML = "No record stored at "+key_span.outerHTML
      }  else {
        message.innerHTML = "Link stored at " + key_span.outerHTML + " is an invalid URL!"
      }

      output.appendChild(message);
  }

  async function main() {
    try {
      const link = await getLink();
      showSuccess(link_key, link.href)
      setTimeout(() => {
        window.location = link;
      }, 1000);

    } catch (error: any) {
      showFailure(link_key, error)
    }
  }

  main()

}
