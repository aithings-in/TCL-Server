import nodemailer from "nodemailer";

/**
 * Email Service Class
 * Handles email sending operations
 */
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configure email transporter
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587", 10),
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  /**
   * Send payment reminder email
   */
  public async sendPaymentReminder(
    email: string,
    name: string,
    leagueType: string,
    amount: number,
    registrationId: string
  ): Promise<void> {
    const leagueName = this.getLeagueName(leagueType);

    const mailOptions = {
      from: `"Turbo Cricket League" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Payment Reminder - ${leagueName} Registration`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9fafb; }
            .button { display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Turbo Cricket League</h1>
            </div>
            <div class="content">
              <h2>Payment Reminder</h2>
              <p>Dear ${name},</p>
              <p>This is a reminder that your payment for <strong>${leagueName}</strong> registration is still pending.</p>
              <p><strong>Registration Details:</strong></p>
              <ul>
                <li>League: ${leagueName}</li>
                <li>Amount: ₹${amount}</li>
                <li>Registration ID: ${registrationId}</li>
              </ul>
              <p>Please complete your payment to secure your spot in the league.</p>
              <p>If you have already made the payment, please ignore this email.</p>
              <p>Best regards,<br>Turbo Cricket League Team</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Payment reminder email sent to ${email}`);
    } catch (error) {
      console.error(`Failed to send payment reminder email to ${email}:`, error);
      throw error;
    }
  }

  /**
   * Get league name from league type
   */
  private getLeagueName(leagueType: string): string {
    const leagueNames: Record<string, string> = {
      "t20-2026": "T20 League 2026",
      "t10-2026": "T10 League 2026",
      trial: "Trial Registration",
    };
    return leagueNames[leagueType] || leagueType;
  }

  /**
   * Send generic email
   */
  public async sendEmail(
    to: string,
    subject: string,
    html: string
  ): Promise<void> {
    const mailOptions = {
      from: `"Turbo Cricket League" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error(`Failed to send email to ${to}:`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const emailService = new EmailService();

