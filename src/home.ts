import agent from './agent';

export default function(req: any, router: any) {
  
  const output = document.querySelector<HTMLParagraphElement>('#output')!;
  output.innerHTML = ''

  function goToAccount() {
    router.goTo(agent.session.handle)
  }

  function setupLogin() {
    const form = document.createElement('form');
    form.id = 'login_form';
    const handle = document.createElement('input');
    handle.id = 'handle';
    handle.placeholder = 'Handle/E-mail';
    handle.autocapitalize = 'off';
    const password = document.createElement('input');
    password.id = 'password';
    password.placeholder = 'App Password';
    password.type = 'password';
    password.autocapitalize = 'off';
    const login = document.createElement('button');
    login.innerText = "Login"

    const error_msg = document.createElement('p');
    error_msg.className = 'error_msg'


    form.onsubmit = async (e) => {
      e.preventDefault();
      try {
        await agent.login({
          identifier: handle.value,
          password: password.value
        })
        goToAccount();
      } catch (error) {
        error_msg.innerText = error.message;
        console.error(error)
      }
    }

    form.appendChild(handle);
    form.appendChild(password);
    form.appendChild(login);
    form.appendChild(error_msg);
    output.appendChild(form);
  }

  async function main() {
    const saved_session = window.localStorage.getItem('session');
    if (saved_session && agent.resumeSession) {
      await agent.resumeSession(JSON.parse(saved_session));
      goToAccount();
    } else {
      setupLogin();
    }
  }


  main();
}
