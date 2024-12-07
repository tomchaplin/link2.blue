// @ts-nocheck
import './style.css'
import {AtpAgent} from '@atproto/api'

enum LinkError {
  NoRecord=0,
  InvalidLink=1
}

function error_string(error: LinkError): string {
  const key = window.location.pathname.substring(1);
  if (error == LinkError.NoRecord) {
    return "No record stored at "+key
  } else {
    return "Link stored at "+key+" is an invalid URL!"
  }
}

type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };


const output =document.querySelector<HTMLParagraphElement>('#output')!;

function shouldAttemptRedirect():boolean {
    const path_parts = window.location.pathname.substring(1).split('/');
    return path_parts.length == 2;
}

async function getLink() : Promise<Result<URL, LinkError>> {
  let link;
  try {
    const path_parts = window.location.pathname.substring(1).split('/');
    const handle = path_parts[0];
    const rkey = path_parts[1]; 

    const agent = new AtpAgent({service: 'https://bsky.social'});

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
    return {ok: false, error:LinkError.NoRecord}
  }

  try {
    return {ok: true, value:new URL(link)}
  } catch {
    return { ok: false, error:LinkError.InvalidLink}
  }
}

async function main() {
  if (shouldAttemptRedirect()) {
    const link_result = await getLink();

    if (link_result.ok) {
      const key = window.location.pathname.substring(1);
      const link = link_result.value;
      output.innerText = 'Resolved link\n' + key + ' ⟶ ' + link.href + '\nRedirecting...';
      setTimeout(() => {
        window.location = link;
      }, 3000);
    } else {
      output.innerText = error_string(link_result.error);
    }
  }
}

main()


