import { transporter } from "./nodemailer.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <title>Email Verification</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f5f5f5;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        <tr>
        <td align="center" style="padding: 40px 0;">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <tr>
                <td align="center" style="background: linear-gradient(to right, #a18cd1, #fbc2eb); padding: 30px;">
                <h1 style="margin: 0; font-size: 24px; color: white;">Verify Your Email</h1>
                </td>
            </tr>
            <tr>
                <td style="padding: 30px; font-family: Arial, sans-serif; color: #333;">
                <p>Hello!</p>
                <p>Thank you for signing up! Please use the following verification code:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <span style="font-size: 36px; font-weight: bold; letter-spacing: 6px; color: #a18cd1;">${verificationToken}</span>
                </div>
                <p>If you didn't create an account, you can ignore this email.</p>
                <p style="margin-top: 30px;">Cheers,<br><strong>Lafsha Team</strong></p>
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 20px; font-size: 12px; color: #888;">
                <p>This is an automated message. Please do not reply.</p>
                </td>
            </tr>
            </table>
        </td>
        </tr>
    </table>
    </body>
    </html>
    `;


    const info = await transporter.sendMail({
      from: `"Lafsha" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your email",
      html,
    });

    console.log("verification email sent:", info.messageId);
  } catch (error) {
    console.error("error sending verification email", error);
    throw new Error(`error sending verification email: ${error.message}`);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  try {
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <title>Welcome to Lafsha</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f5f5f5;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        <tr>
        <td align="center" style="padding: 40px 0;">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <tr>
                <td align="center" style="background: linear-gradient(to right, #a18cd1, #fbc2eb); padding: 30px;">
                <h1 style="margin: 0; font-size: 24px; color: white;">Welcome to Lafsha, ${name}!</h1>
                </td>
            </tr>
            <tr>
                <td style="padding: 30px; font-family: Arial, sans-serif; color: #333;">
                <p>Hello ${name}!</p>
                <p>Thank you for joining us! We're thrilled to have you on board.</p>
                <p>Feel free to explore and get the most out of our platform. We’ve got some amazing features to help you connect, collaborate, and grow.</p>
                <p>If you have any questions or need help getting started, our support team is always here for you.</p>
                <p style="margin-top: 30px;">Cheers,<br><strong>The Lafsha Team</strong></p>
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 20px; font-size: 12px; color: #888;">
                <p>This is an automated message. Please do not reply.</p>
                </td>
            </tr>
            </table>
        </td>
        </tr>
    </table>
    </body>
    </html>
    `;

    const info = await transporter.sendMail({
      from: `"Lafsha" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to Lafsha!",
      html,
    });

    console.log("welcome email sent:", info.messageId);
  } catch (error) {
    console.error("error sending welcome email", error);
    throw new Error(`error sending welcome email: ${error.message}`);
  }
};