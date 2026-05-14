import { transporter } from "../config/mailer.js";
import crypto from "crypto";
import { Invite } from "../config/invite.js";

export const sendInviteEmail = async ({ email, projectId }) => {
  let invite;

  try {
    if (!email) throw new Error("Email required");
    if (!projectId) throw new Error("Project ID required");

    const token = crypto.randomBytes(32).toString("hex");

    const inviteLink = `http://localhost:7000/accept-invite?token=${token}`;

    invite = await Invite.create({
      email,
      projectId,
      token,
      status: "pending",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    console.log("Sending invite email with TeamSpace template");

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "You're invited!",
      html: `

      <div style="background-color: #F9FAFB; padding: 40px 20px; font-family: 'Inter', -apple-system, sans-serif; color: #1F2937;">
  <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border: 1px solid #E5E7EB; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); overflow: hidden;">
    
    <div style="padding: 30px 40px; border-bottom: 1px solid #F3F4F6; text-align: center;">
      <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #2563EB;">TeamSpace</h1>
    </div>

    <div style="padding: 40px;">
      <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: 600;">You've been invited</h2>
      <p style="margin: 0 0 32px; font-size: 16px; line-height: 1.6; color: #4B5563;">
        Hello! You have been invited to join <strong>TeamSpace</strong>, your new premium workspace for documents and project management. Click the button below to accept your invitation and get started.
      </p>
      
      <div style="text-align: center;">
        <a href="${inviteLink}" 
           style="display: inline-block; background-color: #2563EB; color: #ffffff; padding: 14px 32px; font-weight: 600; text-decoration: none; border-radius: 8px; font-size: 16px; transition: background-color 0.2s;">
           Accept Invitation
        </a>
      </div>
    </div>

    <div style="padding: 20px 40px; background-color: #F9FAFB; border-top: 1px solid #F3F4F6; text-align: center;">
      <p style="margin: 0; font-size: 12px; color: #9CA3AF;">
        If you weren't expecting this invitation, you can safely ignore this email.
      </p>
    </div>
  </div>
</div>
      `,
    });

    return { success: true, message: "Invite sent successfully" };

  } catch (error) {
    if (invite?._id) {
      await Invite.findByIdAndDelete(invite._id).catch(() => {});
    }

    console.error("Email sending failed:", error);
    return { success: false, error };
  }
};
