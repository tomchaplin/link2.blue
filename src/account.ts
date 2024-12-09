import { agent } from './common'

enum AccountError {
  ResolveError,
  ListError
}

export default function(req: any, router: any) {
  const output = document.querySelector<HTMLParagraphElement>('#output')!;
  output.innerHTML = '';


  async function listRecords() {
    try {
      const records = await agent.com.atproto.repo.listRecords({
        repo: agent.accountDid,
        collection: 'blue.link2.redirect'
      })
      return records.data.records;
    } catch {
      return AccountError.ListError
    }
  }

  function formatRecords(records: any) {
    return records.map((record) => {
      const parts = record.uri.split('/');
      const key = parts[parts.length - 1];
      return [key, record.value.link]
    })
  }

  function createTableCell(type, text) {
    const th = document.createElement(type);
    th.innerText = text;
    return th
  }

  // TODO: Add link to QR code
  function createRecordRow(row) {
    const row_tr = document.createElement('tr');
    row_tr.appendChild(createTableCell('td', row[0]))
    row_tr.appendChild(createTableCell('td', row[1]))

    const delete_button = document.createElement('button');
    delete_button.innerText = 'Delete';
    delete_button.onclick = async (e) => {
      e.preventDefault();
      await agent.com.atproto.repo.deleteRecord({
        repo: agent.accountDid,
        collection: 'blue.link2.redirect',
        rkey: row[0]
      })
      location.reload();
    }

    const test_button = document.createElement('button');
    test_button.innerText = 'Test';
    test_button.onclick = async (e) => {
      router.goTo(`/${agent.session.handle}/${row[0]}`)
    }

    const button_td = document.createElement('td');
    button_td.appendChild(delete_button);
    button_td.appendChild(test_button);

    row_tr.appendChild(button_td);
    return row_tr
  }

  function createNewRow() {
    const form = document.createElement('form');
    form.id = "new_link"


    const row_tr = document.createElement('tr');

    const input_key = document.createElement('input');
    input_key.setAttribute('form', 'new_link');
    const key_td = document.createElement('td');
    key_td.appendChild(input_key);

    const input_link = document.createElement('input');
    input_link.setAttribute('form', 'new_link');
    const link_td = document.createElement('td');
    link_td.appendChild(input_link);

    const button = document.createElement('button');
    button.innerText = 'Add'
    button.setAttribute('form', 'new_link');
    const button_td = document.createElement('td');
    button_td.appendChild(button);

    form.onsubmit = async (e) => {
      e.preventDefault();
      console.log(input_key.value)
      console.log(input_link.value);
      await agent.com.atproto.repo.createRecord({
        repo: agent.accountDid,
        collection: 'blue.link2.redirect',
        rkey: input_key.value,
        record: {
          link: input_link.value,
          "$type": "blue.link2.redirect",
          "createdAt": new Date().toISOString()
        }
      })
      location.reload()
    }
    output.appendChild(form);

    row_tr.appendChild(key_td);
    row_tr.appendChild(link_td);
    row_tr.appendChild(button_td);

    return row_tr

  }

  function buildRecordTable(records) {
    const table = document.createElement('table');
    const header = document.createElement('tr');
    header.appendChild(createTableCell('th', 'Key'));
    header.appendChild(createTableCell('th', 'Link'));
    header.appendChild(createTableCell('th', 'Actions'));
    table.appendChild(header);
    for (let row of records) {
      table.appendChild(createRecordRow(row));
    }
    table.appendChild(createNewRow());
    return table

  }

  function setupLoggedInMessage() {
    const message = document.createElement('p');
    message.innerText = 'Logged into ' + agent.session.handle;
    output.appendChild(message);
  }

  async function logout() {
    await agent.logout();
    window.localStorage.removeItem('session');
    router.goTo('/');
  }

  function setupLogout() {
    const logout_button = document.createElement('button');
    logout_button.innerText = 'Logout';
    logout_button.onclick = async (e) => {
      e.preventDefault();
      await logout();
    }
    output.appendChild(logout_button);
  }

  async function main() {

    // Check we are logged into the correct account
    const saved_session = window.localStorage.getItem('session');
    if (!saved_session) {
      router.goTo('/');
      return
    }
    try {
      agent.resumeSession(JSON.parse(saved_session));
    } catch {
      router.goTo('/');
      return
    }
    if (agent.session.handle != req.param.handle) {
      router.goTo('/');
      return
    }

    // Display page
    try {
      setupLoggedInMessage();
      const records = formatRecords(await listRecords());
      const table = buildRecordTable(records)
      output.appendChild(table);
      setupLogout();
    } catch (error) {
      console.log(error)
    }
  }

  main()
}
