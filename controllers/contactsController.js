exports.contactUs = async function(request, response, next) {
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
            user: 'eldon.bergstrom86@ethereal.email',
            pass: '6pZCbe5KGebQ2gWQGq'
        }
    });
    await transporter.sendMail({
        from: request.body.email,
        to: process.env.EMAIL,
        subject: request.body.subject,
        text: request.body.text
    });
    response.json({sent: true});
}