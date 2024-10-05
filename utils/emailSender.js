import dotenv from "dotenv";
import nodemailer from "nodemailer";
import emailQueue from "./memoryQueue.js";

dotenv.config();

// Configuration de Nodemailer
const transporter = nodemailer.createTransport({
  host: "mail.az-tenders.com",
  port: 465,
  secure: true,
  auth: {
    user: "ne-pas-repondre@az-tenders.com",
    pass: process.env.EMAIL_PASS,
  },
});

// Vérifier la configuration de Nodemailer
// transporter.verify((error, success) => {
//   if (error) {
//     console.log("Transporter configuration error:", error);
//   } else {
//     console.log("Server is ready to take our messages");
//   }
// });
// Structure HTML de l'email

// Processus de la file de tâches
emailQueue.on("process", async (job) => {
  const { email, subject, text } = job;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333; text-align: center;">
      <div style="padding: 20px; background-color: #f7f7f7;">
        <h1 style="font-size: 36px; color: #333;">
          <span style="color: green;">AZ</span> Tender
        </h1>
      </div>
      <div style="padding: 20px;">
        <h2 style="font-size: 24px; color: #333;">${subject}</h2>
        <p>${text}</p>
        <p style="font-size: 18px; color: #777;">Découvrez nos derniers appels d'offres et plus encore sur notre site web.</p>
        <a href="https://az-tenders.com" style="display: inline-block; padding: 10px 20px; margin-top: 20px; background-color: green; color: white; text-decoration: none; border-radius: 5px; font-size: 16px;">Visitez notre site</a>
      </div>
      <div style="padding: 20px; background-color: #f7f7f7; text-align: center;">
        <p style="font-size: 14px; color: #777;">&copy; 2024 AZ-Tenders. Tous droits réservés.</p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: "ne-pas-repondre@az-tenders.com",
    to: email,
    subject: subject,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(`Failed to send email to ${email}:`, error);
  }
});

export default emailQueue;
