import SibApiV3Sdk from 'sib-api-v3-sdk';

const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

export async function enviarEmail(para, assunto, texto) {
  try {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const sendSmtpEmail = {
      to: [{ email: para }],
      sender: { email: 'helpdeskproject1234@gmail.com', name: 'HelpDeskService' },  
      subject: assunto,
      textContent: texto,
    };
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`📧 E-mail enviado com sucesso para ${para}!`);
  } catch (error) {
    console.error('Erro ao enviar e-mail via Brevo:', error.response ? error.response.body : error);
    throw error;
  }
}
