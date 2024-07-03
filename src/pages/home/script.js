

const electron = window.electron;
const form = document.forms.formEmail;
const alert = document.querySelector('#alert');
const newTag = document.createElement.bind(document);
const controllLoading = document.querySelector('#controllLoading');



function setIsLoading(isLoading = true) {
      console.log(isLoading)
      if (isLoading) {
            if (!form.classList.contains('hidden')) {
                  console.log({ a: 'estou aqui' })
                  form.classList.add('hidden');
            }

            if (controllLoading.classList.contains('hidden'))
                  controllLoading.classList.remove('hidden');
      } else {
            if (form.classList.contains('hidden'))
                  form.classList.remove('hidden');

            if (!controllLoading.classList.contains('hidden'))
                  controllLoading.classList.add('hidden');
      }
}

async function handlerSenEmailTester(event) {
      event.preventDefault();

      setIsLoading(true);

      let formControl = event.target;

      let dados = {
            emailOrigem: formControl.elements["emailOrigem"].value,
            port: formControl.elements["porta"].value,
            host: formControl.elements["host"].value,
            usuario: formControl.elements["usuario"].value,
            senha: formControl.elements["senha"].value,
            destinatario: formControl.elements["destinatario"].value,
            enableSSL: formControl.elements["ssl"].checked,
      }

      let isError = validaCampos(dados);

      if (isError) {
            setTimeout(() => {
                  setIsLoading(false);
            }, 500);
            return;
      }
      setTimeout(() => {
            electron.send(dados);
      }, 1000);


}

function createList(array, controller) {
      controller.textContent = "";
      let ul = newTag('ul');
      ul.classList.add('list-inside', 'list-disc')

      array.forEach((item) => {
            let li = newTag('li');
            li.textContent = item;
            ul.appendChild(li);
      })

      controller.appendChild(ul);
}

function borderController(nameController, isError = true) {
      let Tcontroller = form.elements[nameController];

      if (!!Tcontroller) {
            if (isError) {
                  Tcontroller.classList.remove('border-white', 'focus:border-teal-500');
                  Tcontroller.classList.add('border-rose-500', 'focus:border-rose-500', 'active:border-rose-500');

            } else {
                  Tcontroller.classList.remove('border-rose-500', 'focus:border-rose-500');
                  Tcontroller.classList.add('border-white', 'focus:border-teal-500');
            }

      }

}

function handlerChange(event) {
      borderController(event.target.name, !!event.target.value ? false : true);
}

function validaCampos(args) {

      let arrayError = [];

      if (!args.emailOrigem) {
            borderController('emailOrigem');
            arrayError.push('É necessario infomar o email de origem');
      } else {
            borderController('emailOrigem', false);
      }
      if (!args.port) {
            borderController('porta');
            arrayError.push('É necessario infomar a porta');
      } else {
            borderController('porta', false);
      }
      if (!args.host) {
            borderController('host');
            arrayError.push('É necessario infomar o host');
      } else {
            borderController('host', false);
      }
      if (!args.usuario) {
            borderController('usuario');
            arrayError.push('É necessario infomar o usuario');
      } else {
            borderController('usuario', false);
      }
      if (!args.senha) {
            borderController('senha');
            arrayError.push('É necessario infomar a senha');
      } else {
            borderController('senha', false);
      }
      if (!args.destinatario) {
            borderController('destinatario');
            arrayError.push('É necessario infomar o destinatario');
      } else {
            borderController('destinatario', false);
      }

      if (arrayError.length > 0) {

            createList(arrayError, alert)

            if (!alert.classList.contains("animate-fadeIn")) {
                  alert.classList.remove('hidden')
                  if (alert.classList.contains('animate-fadeOut')) {
                        alert.classList.remove("animate-fadeOut");
                  }
                  alert.classList.add("animate-fadeIn");
            }

            setTimeout(() => {
                  if (alert.classList.contains('animate-fadeIn')) {
                        alert.classList.remove('animate-fadeIn')
                        alert.classList.add('animate-fadeOut')
                  }
            }, 5000)


            return true;
      }

      return false;

}

let campos = new Set();


form?.addEventListener('submit', handlerSenEmailTester)
Object.values(form.elements).forEach(item => {
      campos.add(item.name);
});

for (let item of campos) {
      if (!!item) {
            form.elements[item].addEventListener('keyup', handlerChange)
      }
}


// [...campos].forEach(item => form.elements[item].addEventListener('keyup', handlerChange))


