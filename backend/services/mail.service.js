import { transporter, sender } from "../mail/nodemailer.js";
import {
	PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
	VERIFICATION_EMAIL_TEMPLATE,
} from "../mail/emailTemplates.js";

class MailService {
	async sendVerificationEmail(email, verificationToken) {
		const info = await transporter.sendMail({
			from: `"${sender.name}" <${sender.email}>`,
			to: email,
			subject: "Verify your email",
			html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
		});
		return info;
	}

	async sendWelcomeEmail(email, name) {
		const html = `
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Welcome</title>
			</head>
			<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
				<div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
					<h1 style="color: white; margin: 0;">Welcome to Our App</h1>
				</div>
				<div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
					<p>Hello ${name || "there"},</p>
					<p>We're excited to have you on board. If you have any questions, just reply to this email — we're always happy to help.</p>
					<p>Best regards,<br/>${sender.name}</p>
				</div>
			</body>
			</html>
		`;

		const info = await transporter.sendMail({
			from: `"${sender.name}" <${sender.email}>`,
			to: email,
			subject: "Welcome to our app",
			html,
		});
		return info;
	}

	async sendPasswordResetEmail(email, resetURL) {
		const info = await transporter.sendMail({
			from: `"${sender.name}" <${sender.email}>`,
			to: email,
			subject: "Reset your password",
			html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
		});
		return info;
	}

	async sendResetSuccessEmail(email) {
		const info = await transporter.sendMail({
			from: `"${sender.name}" <${sender.email}>`,
			to: email,
			subject: "Password Reset Successful",
			html: PASSWORD_RESET_SUCCESS_TEMPLATE,
		});
		return info;
	}
}

export default new MailService();


