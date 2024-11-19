import nodemailer from 'nodemailer'

const sendEmail = async (options) => {
    //create transporter //for DEV use Mailtrap.io
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })
    //set options
    const mailOptions = {
        from: 'Natours <noreply@natours.com>',
        to: options.email,
        subject: options.subject,
        text: options.message

    }
    //send email
    await transporter.sendMail(mailOptions)
}