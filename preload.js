
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
      send: async (args) => await ipcRenderer.sendSync('dispatch-email', args)
})

window.addEventListener('DOMContentLoaded', () => {
      const replaceText = (selector, text) => {
            const element = document.getElementById(selector)
            if (element) element.innerText = text
      }

      for (const dependency of ['chrome', 'node', 'electron']) {
            replaceText(`${dependency}-version`, process.versions[dependency])
      }

      ipcRenderer.on("dispatch-email-response", (event, args) => {
            const controllerLoading = document.querySelector('#controllLoading');
            const form = document.forms.formEmail;
            const alert = document.querySelector('#alert');

            controllerLoading.classList.add('hidden');
            form.classList.remove('hidden');

            if (!!args?.errorMessage) {
                  alert.textContent = args?.errorMessage ?? ""
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
            }


      })

})



