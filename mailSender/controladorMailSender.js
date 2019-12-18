const nodemailer = require("nodemailer");
const mailer = require("../lib/conexionMail");

async function enviarMails(req, res) {
  let datos = req.body;

  let totalDestinatarios = datos.destinatarios.length;
  let totalEnviados = 0;
  let mailsNoEnviados = [];
  let errorString;

  datos.destinatarios.forEach(element => {
    let cuerpo = datos.cuerpo
      .replace('{nombre}', element.nombre)
      .replace('{apellido}', element.apellido)
      .replace('{examen}', element.examen)
      .replace('{dia}', element.dia)
      .replace('{hora}', element.hora)
      .replace('{cd}', element.cd);

    const mailOptions = {
      from: mailer.remitente,
      to: element.email,
      subject: datos.asunto,
      text: cuerpo,
    };

    mailer.transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        errorString = error.toString();
        mailsNoEnviados.push(`[ ${element.email} de ${element.nombre} ${element.apellido} ]`)

      } else {
        console.log(`Email sent: ${info.response} / ${element.email} de ${element.nombre} ${element.apellido}`);
        totalEnviados += 1;

        if (totalEnviados === totalDestinatarios) {
          res.status(200).json({
            status:
              `Enviados ${totalEnviados}/${totalDestinatarios} Mails./Recuerda siempre verificar la bandeja de entrada y salida de la cuenta de Email./${(mailsNoEnviados.length) ? `Los siguientes Emails no pudieron ser enviados: ${mailsNoEnviados} -> ${errorString ? errorString : null}` : ""}`
          });
          return;
        }
      }
    });

    res.setTimeout(15000, () => {
      res.status(200).json({
        status:
          `Enviados ${totalEnviados} de ${totalDestinatarios} emails./Recuerda siempre verificar la bandeja de entrada y salida de la cuenta de Email./${(mailsNoEnviados.length) ? `Los siguientes Emails no pudieron ser enviados: ${mailsNoEnviados} -> ${errorString ? errorString : null}` : ""}`
      });
    });

  });


}







module.exports = {
  //main: main,
  enviarMails: enviarMails,
}
