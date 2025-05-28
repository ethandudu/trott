// src/utils/mailer.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false, // true si port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendWelcomeEmail(to: string) {
  console.log('Sending email to:', to);

  await transporter.sendMail({
    from: `GPS Tracker <${process.env.SMTP_USER}>`,
    to,
    subject: 'Bienvenue sur GPS Tracker !',
    text: `Bonjour,

Nous sommes ravis de vous accueillir sur GPS Tracker, votre solution de suivi GPS fiable et performante ! 🚗

Grâce à notre service, vous pouvez :
- Suivre vos véhicules en temps réel.
- Garantir la sécurité de vos biens et de vos proches.

Pour commencer, connectez-vous à votre compte et explorez toutes les fonctionnalités que nous avons conçues pour vous simplifier la vie.

Si vous avez des questions ou besoin d'aide, notre équipe de support est à votre disposition 24/7.

Merci de nous faire confiance. Nous sommes impatients de vous accompagner dans cette aventure !

Cordialement,
L'équipe GPS Tracker`,
    html: `<p>Bonjour,</p>
           <p>Nous sommes ravis de vous accueillir sur <strong>GPS Tracker</strong>, votre solution de suivi GPS fiable et performante ! 🚗</p>
           <p>Grâce à notre service, vous pouvez :</p>
           <ul>
             <li>Suivre vos véhicules en temps réel.</li>
             <li>Garantir la sécurité de vos biens et de vos proches.</li>
           </ul>
           <p>Pour commencer, connectez-vous à votre compte et explorez toutes les fonctionnalités que nous avons conçues pour vous simplifier la vie.</p>
           <p>Si vous avez des questions ou besoin d'aide, notre équipe de support est à votre disposition 24/7.</p>
           <p>Merci de nous faire confiance. Nous sommes impatients de vous accompagner dans cette aventure !</p>
           <p>Cordialement,<br>L'équipe GPS Tracker</p>`,
  }).then(() => {
    console.log('Email sent successfully');
  }).catch((error) => {
    console.error('Error sending email:', error);
  });
}
