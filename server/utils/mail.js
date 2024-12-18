import nodemailer from "nodemailer";

const sendEmail = async (to, subject, message) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: true
        }
    });

    let email = await transporter.sendMail({
        // from: config.get('EMAIL_SERVICE').EMAIL,
        from: process.env.EMAIL_USERNAME,
        to: to, // list of receivers
        subject: subject,
        text: message,
        html: message // html body
    });
    return email;
};
export { sendEmail }