// import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST || 'smtp.gmail.com',
//   port: Number(process.env.EMAIL_PORT) || 587,
//   secure: process.env.EMAIL_SECURE === 'true',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// export const sendVerificationEmail = async (to, otp) => {
//   if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
//     throw new Error(
//       'Email transport is not configured. Set EMAIL_USER and EMAIL_PASS in server/.env'
//     );
//   }

//   await transporter.sendMail({
//     from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
//     to,
//     subject: 'Verify your Gyaanmate account',
//     text: `Your Gyaanmate verification code is ${otp}. It expires in 15 minutes.`,
//     html: `
//       <div style="font-family: Arial, sans-serif; color: #1f2937;">
//         <h2>Verify your Gyaanmate account</h2>
//         <p>Your verification code is:</p>
//         <p style="font-size: 24px; font-weight: bold;">${otp}</p>
//         <p>This code expires in 15 minutes.</p>
//       </div>
//     `,
//   });
// };



import nodemailer from 'nodemailer';

// const createTransporter = () => nodemailer.createTransport({
//   host: process.env.EMAIL_HOST || 'smtp.gmail.com',
//   port: Number(process.env.EMAIL_PORT) || 587,
//   secure: process.env.EMAIL_SECURE === 'true',
//   connectionTimeout: Number(process.env.EMAIL_CONNECTION_TIMEOUT) || 10000,
//   greetingTimeout: Number(process.env.EMAIL_GREETING_TIMEOUT) || 10000,
//   socketTimeout: Number(process.env.EMAIL_SOCKET_TIMEOUT) || 10000,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });


const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    logger: true,
    debug: true,
  });

// const transporter = createTransporter();
// console.log("EMAIL_USER =", process.env.EMAIL_USER);
// console.log("EMAIL_PASS =", process.env.EMAIL_PASS ? "FOUND" : "MISSING");

const getFromAddress = () =>
  process.env.EMAIL_FROM || `"Gyaanmate" <${process.env.EMAIL_USER}>`;

export const sendVerificationEmail = async (to, otp) => {
  const transporter = createTransporter();
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("Sending reset email to:", to);
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error(
      'Email transport is not configured. Set EMAIL_USER and EMAIL_PASS in server/.env'
    );
  }

  await transporter.verify();
  console.log("SMTP connection successful");

  await transporter.sendMail({
    from: getFromAddress(),
    to,
    subject: 'Verify your Gyaanmate account',
    text: `Your Gyaanmate verification code is ${otp}. It expires in 15 minutes.`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Verify Email</title>
      </head>

      <body style="margin:0; padding:0; background:#f4f7fb; font-family:Arial, sans-serif;">

        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f7fb; padding:40px 0;">
          <tr>
            <td align="center">

              <table width="600" cellpadding="0" cellspacing="0" border="0"
                style="background:#ffffff; border-radius:18px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.08);">

                <!-- Header -->
                <tr>
                  <td
                    style="
                      background:linear-gradient(135deg, #4f46e5, #7c3aed);
                      padding:40px 30px;
                      text-align:center;
                      color:white;
                    "
                  >
                    <h1 style="margin:0; font-size:32px; font-weight:700;">
                      Gyaanmate
                    </h1>

                    <p style="margin-top:12px; font-size:16px; opacity:0.95;">
                      Learn smarter. Build faster. Grow bigger.
                    </p>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding:40px 35px; color:#374151;">

                    <h2 style="margin-top:0; font-size:28px; color:#111827;">
                      Verify Your Email Address
                    </h2>

                    <p style="font-size:16px; line-height:28px; color:#4b5563;">
                      Welcome to <strong>Gyaanmate</strong> 🎉
                      <br /><br />
                      Please use the verification code below to activate your account.
                    </p>

                    <!-- OTP Box -->
                    <div
                      style="
                        margin:35px 0;
                        text-align:center;
                      "
                    >
                      <div
                        style="
                          display:inline-block;
                          background:#eef2ff;
                          color:#4f46e5;
                          padding:18px 40px;
                          border-radius:14px;
                          font-size:38px;
                          font-weight:700;
                          letter-spacing:10px;
                          border:2px dashed #6366f1;
                        "
                      >
                        ${otp}
                      </div>
                    </div>

                    <p style="font-size:15px; line-height:26px; color:#6b7280;">
                      This verification code will expire in
                      <strong>15 minutes</strong>.
                    </p>

                    <p style="font-size:15px; line-height:26px; color:#6b7280;">
                      If you didn’t create an account, you can safely ignore this email.
                    </p>

                    <!-- Button -->
                    <div style="margin-top:35px; text-align:center;">
                      <a
                        href="#"
                        style="
                          display:inline-block;
                          background:linear-gradient(135deg, #4f46e5, #7c3aed);
                          color:white;
                          text-decoration:none;
                          padding:14px 34px;
                          border-radius:10px;
                          font-size:16px;
                          font-weight:600;
                        "
                      >
                        Verify Account
                      </a>
                    </div>

                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td
                    style="
                      background:#f9fafb;
                      padding:25px 30px;
                      text-align:center;
                      border-top:1px solid #e5e7eb;
                    "
                  >
                    <p style="margin:0; font-size:14px; color:#6b7280;">
                      © 2026 Gyaanmate — All rights reserved.
                    </p>

                    <p style="margin-top:8px; font-size:13px; color:#9ca3af;">
                      Empowering students with modern learning experiences.
                    </p>
                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>

      </body>
      </html>
    `,
  });
};

export const sendPasswordResetEmail = async (to, otp) => {
  const transporter = createTransporter();
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("Sending reset email to:", to);
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error(
      'Email transport is not configured. Set EMAIL_USER and EMAIL_PASS in server/.env'
    );
  }

  await transporter.verify();
  console.log("SMTP connection successful");

  await transporter.sendMail({
    from: getFromAddress(),
    to,
    subject: 'Reset your Gyaanmate password',
    text: `Your password reset code is ${otp}. It expires in 15 minutes. If you did not request this, ignore this email.`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head><meta charset="UTF-8" /><title>Reset Password</title></head>
      <body style="margin:0; padding:0; background:#f4f7fb; font-family:Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb; padding:40px 0;">
          <tr><td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#fff; border-radius:18px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.08);">
              <tr>
                <td style="background:linear-gradient(135deg, #4f46e5, #7c3aed); padding:36px 30px; text-align:center; color:white;">
                  <h1 style="margin:0; font-size:28px;">Gyaanmate</h1>
                  <p style="margin-top:10px; font-size:15px; opacity:0.95;">Password reset request</p>
                </td>
              </tr>
              <tr>
                <td style="padding:36px 32px; color:#374151;">
                  <h2 style="margin-top:0; font-size:24px; color:#111827;">Reset your password</h2>
                  <p style="font-size:16px; line-height:26px; color:#4b5563;">
                    Use this code on the reset password page. It expires in <strong>15 minutes</strong>.
                  </p>
                  <div style="margin:28px 0; text-align:center;">
                    <span style="display:inline-block; background:#eef2ff; color:#4f46e5; padding:16px 36px; border-radius:14px; font-size:34px; font-weight:700; letter-spacing:8px; border:2px dashed #6366f1;">${otp}</span>
                  </div>
                  <p style="font-size:14px; color:#6b7280;">If you did not request a password reset, you can safely ignore this email.</p>
                </td>
              </tr>
              <tr>
                <td style="background:#f9fafb; padding:20px; text-align:center; border-top:1px solid #e5e7eb;">
                  <p style="margin:0; font-size:13px; color:#9ca3af;">© 2026 Gyaanmate</p>
                </td>
              </tr>
            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `,
  });
};

export const sendLogoutReloginEmail = async (to, name = 'Learner') => {
  const transporter = createTransporter();
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("Sending reset email to:", to);
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error(
      'Email transport is not configured. Set EMAIL_USER and EMAIL_PASS in server/.env'
    );
  }

  const loginUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/login`;

  await transporter.verify();
  console.log("SMTP connection successful");

  await transporter.sendMail({
    from: getFromAddress(),
    to,
    subject: 'You have logged out of Gyaanmate',
    text: `Hi ${name}, you have successfully logged out of Gyaanmate. To continue learning, log in again here: ${loginUrl}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head><meta charset="UTF-8" /><title>Logged Out</title></head>
      <body style="margin:0; padding:0; background:#f4f7fb; font-family:Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb; padding:40px 0;">
          <tr><td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#fff; border-radius:18px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.08);">
              <tr>
                <td style="background:linear-gradient(135deg, #4f46e5, #7c3aed); padding:36px 30px; text-align:center; color:white;">
                  <h1 style="margin:0; font-size:28px;">Gyaanmate</h1>
                  <p style="margin-top:10px; font-size:15px; opacity:0.95;">Logout confirmation</p>
                </td>
              </tr>
              <tr>
                <td style="padding:36px 32px; color:#374151;">
                  <h2 style="margin-top:0; font-size:24px; color:#111827;">You have logged out</h2>
                  <p style="font-size:16px; line-height:26px; color:#4b5563;">
                    Hi <strong>${name}</strong>, your Gyaanmate session has ended successfully.
                  </p>
                  <p style="font-size:16px; line-height:26px; color:#4b5563;">
                    Ready to continue learning? Use the button below to sign in again.
                  </p>
                  <div style="margin-top:30px; text-align:center;">
                    <a href="${loginUrl}" style="display:inline-block; background:linear-gradient(135deg, #4f46e5, #7c3aed); color:white; text-decoration:none; padding:14px 34px; border-radius:10px; font-size:16px; font-weight:600;">
                      Login Again
                    </a>
                  </div>
                  <p style="margin-top:28px; font-size:14px; color:#6b7280;">
                    If this was not you, please reset your password from the login page.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="background:#f9fafb; padding:20px; text-align:center; border-top:1px solid #e5e7eb;">
                  <p style="margin:0; font-size:13px; color:#9ca3af;">© 2026 Gyaanmate</p>
                </td>
              </tr>
            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `,
  });
};

