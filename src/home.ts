import { agent } from './common';

export default function(req:any, router:any) {
  const output = document.querySelector<HTMLParagraphElement>('#output')!;
  output.innerHTML=''

  function goToAccount() {
    router.goTo(agent.session.handle)
  }

  function setupLogin() {
    const form = document.createElement('form');
    form.id = 'login_form';
    const handle = document.createElement('input');
    handle.id = 'handle';
    handle.placeholder = 'Handle/E-mail';
    const password = document.createElement('input');
    password.id = 'password';
    password.placeholder = 'App Password';
    password.type = 'password';
    const login = document.createElement('button');
    login.innerText = "Login"

    form.onsubmit = async (e) => {
      e.preventDefault();
      try {
        await agent.login({
          identifier: handle.value,
          password: password.value
        })
        goToAccount();
      } catch(error) {
        console.error(error)
      }
    }

    form.appendChild(handle);
    form.appendChild(password);
    form.appendChild(login);
    output.appendChild(form);
  }
  
  async function main() {
    const saved_session = window.localStorage.getItem('session');
    if (saved_session) {
      await agent.resumeSession(JSON.parse(saved_session));
      goToAccount();
    } else {
      setupLogin();
    }
  }
  
  
  console.log('Home page');
  main();
}
