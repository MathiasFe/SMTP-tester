const { createTransport } = require('nodemailer');


async function dispatchEmail(args) {
      const transport = createTransport({
            host: args.host,
            port: args.port,
            secure: args.enableSSL,
            auth: {
                  user: args.usuario,
                  pass: args.senha,
            }
      })


      var message = {
            from: args.usuario,
            to: args.destinatario,
            subject: "Email de teste 🚀🚀🚀",
            text: "Email apenas de teste 🚀🚀🚀",
      };

      await transport.sendMail(message, function (err, info) {
            return {
                  errorMessage: err,
            }
      });

}

module.exports = dispatchEmail;