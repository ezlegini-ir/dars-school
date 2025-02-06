import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "mail.igraphical.ir",
  port: 465,
  secure: true,
  auth: {
    user: "test@igraphical.ir",
    pass: "RAMIN3517ram",
  },
});

// VERIFY EMAIL
export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;

  await transporter.sendMail({
    from: `"Dars School" <test@igraphical.ir>`,
    to: email,
    subject: "Confirm Your Email",
    html: `<p>Click <a href="${confirmLink}">Here</a> to confirm your email.</p>`,
  });
};

// RESET PASSWORD
export const sendResetPasswordEmail = async (email: string, token: string) => {
  const resetPasswordLink = `http://localhost:3000/auth/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"Dars School" <test@igraphical.ir>`,
    to: email,
    subject: "Reset Your Passowrd",
    html: `<p>Click <strong><a href="${resetPasswordLink}">Here</a></strong> to reset your password.</p>`,
  });
};
