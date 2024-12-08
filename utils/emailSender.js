import nodemailer from 'nodemailer'
import pug from 'pug'
import {htmlToText} from 'html-to-text'

export class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `Tomas <${process.env.EMAIL_FROM}>`
    }

    createTransport() {
        if (process.env.NODE_ENV === 'production') {
            //send grid not created
            return nodemailer.createTransport({
                service: "SendGrid",
                auth: {
                    user: process.env.SENDGRID_USER,
                    pass: process.env.SENDGRID_PASSWORD
                }
            })

        } else {
            return nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD
                }
            })
        }

    }

    async send(template, subject) {
        //render html base on template
        const path = __dirname + '/../views/emails/' + template + '.pug';
        const html = pug.renderFile(path, {
            firstName: this.firstName,
            url: this.url,
            subject: subject,
        })

        //options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject: subject,
            html: html,
            text: htmlToText.fromString(html)

        }
        //send
        await this.createTransport().sendMail(mailOptions)
    }

    async sendWelcome() {
        await this.send("welcome", "Welcome to the web")
    }

    async sendPasswordReset() {
        await this.send("passwordReset", "Password reset token  - valid 10 min")
    }
}


// const sendEmail = async (options) => {
//     //create transporter //for DEV use Mailtrap.io
//     const transporter = nodemailer.createTransport({
//         host: process.env.EMAIL_HOST,
//         port: process.env.EMAIL_PORT,
//         auth: {
//             user: process.env.EMAIL_USERNAME,
//             pass: process.env.EMAIL_PASSWORD
//         }
//     })
//     //set options
//     const mailOptions = {
//         from: 'Natours <noreply@natours.com>',
//         to: options.email,
//         subject: options.subject,
//         text: options.message
//
//     }
//     //send email
//     await transporter.sendMail(mailOptions)
// }