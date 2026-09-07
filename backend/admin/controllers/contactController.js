const db = require("../../db");
const nodemailer = require("nodemailer");

exports.submitContactForm = async (req, res) => {
  const { name, email, mobile, subject, message } = req.body;

  try {
    const sql = `INSERT INTO contact_messages (name, email, mobile, subject, message) VALUES ($1, $2, $3, $4, $5) RETURNING id`;
    const result = await db.query(sql, [name, email, mobile, subject, message]);

    const transporter = nodemailer.createTransport({
      service: "gmail", //
      auth: {
        user: "balayet@uysys.com", //  email
        pass: "ikyk dsma rliy qnje", // Gmail App Password
      },
    });

    const mailOptions = {
      from: '"Property Website" <balayet@uysys.com>',
      to: email,
      subject: "Message Received - Property Website",
      html: `
                <h3>Hello ${name},</h3>
                <p>Thank you for contacting us. We have received your message regarding <b>${subject}</b>.</p>
                <p>Our team will get back to you soon.</p>
                <br>
                <p>Regards,<br>Property Team</p>
            `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.log("Email Error:", error);
      else console.log("Email Sent:", info.response);
    });

    res.json({
      success: true,
      message: "Message sent successfully and confirmation email dispatched!",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
