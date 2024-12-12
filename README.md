# link2.blue

A proof-of-concept, backend-free redirection service built on the [ATProtocol](https://atproto.com/).

## Architecture

When you visit [`link2.blue/tomchaplin.xyz/test`](https://link2.blue/tomchaplin.xyz/test), this service provides a piece of javascript that does the following:

1. Resolve the handle `tomchaplin.xyz` to a [DID](https://atproto.com/specs/did) and hence a [PDS](https://atproto.com/specs/account).
2. Look for a record with key `test` in the `blue.link2.redirect` collection.
3. If a record is found that contains a URL in the `link`  field, then redirect the browser there.

As such, using a static hosting provider, [`link2.blue`](https://link2.blue) is able to provide a redirection service with the following properties:

1. Users own and control all of their data (and can add/edit/delete redirects to their heart's content).
2. Redirection links are verifiable and inherit the trust/authority of their associated handle.
3. I don't have to pay for a VPS.

As with anything, there are some downsides, the main one being that your users need javascript in order to follow the redirect 🤮.
Also if I stop hosting the JS at [`link2.blue`](https://link2.blue) then your links go dead, but at least you don't lose all your data and can switch to a new provider!

## Account management

The website also provides a nice interface for managing the redirects associated to your handle.
Including:

1. Adding redirects
2. Deleting redirects
3. Creating QR codes (via [qoqr.me](https://goqr.me/api/))

Try it out now by visiting [`link2.blue`](https://link2.blue) and logging in with your Bluesky account (ideally with an app password).
