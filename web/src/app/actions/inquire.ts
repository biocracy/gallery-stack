"use server";

import nodemailer from "nodemailer";

interface InquiryState {
    success?: boolean;
    error?: string;
    message?: string;
}

export async function sendInquiry(
    prevState: InquiryState | null,
    formData: FormData
): Promise<InquiryState> {
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;
    const verification = formData.get("verification") as string;
    const expectedVerification = formData.get("expectedVerification") as string;

    // 1. Human Verification
    if (!verification || verification !== expectedVerification) {
        return {
            success: false,
            error: "Incorrect verification answer. Please try again.",
        };
    }

    // 2. Validate Fields
    if (!email || !message) {
        return {
            success: false,
            error: "Please fill in all required fields.",
        };
    }

    try {
        // 3. Configure Transporter
        // NOTE: In a real production app, use process.env vars for host/user/pass
        // For now, we'll assume a local or mock setup, or log to console if no env vars.
        // If you have SMTP credentials, replace these or use environment variables.

        // Example using Ethereal for testing or console fallback
        const transporter = nodemailer.createTransport({
            // If env vars are present, use them. Otherwise, we might just log it?
            // Actually, nodemailer default transport without options doesn't work well alone.
            // Let's us jsonTransport for dev logging if no env provided.
            ...(process.env.SMTP_HOST ? {
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT) || 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            } : {
                jsonTransport: true // Logs to console in the result
            })
        });

        // 4. Send Email
        const info = await transporter.sendMail({
            from: `"${email}" <${email}>`, // sender address (user's email) - Note: standard SMTP providers might override this to auth user
            to: "contact@artstrut.com", // list of receivers
            subject: `New Inquiry: ${message.substring(0, 30)}...`, // Subject line
            text: message, // plain text body
            html: `<p><strong>From:</strong> ${email}</p><p>${message.replace(/\n/g, "<br>")}</p>`, // html body
        });

        console.log("Message sent: %s", info.messageId);
        if ((info as any).message) {
            console.log("JSON Transport Message: ", (info as any).message); // Log content for dev
        }

        return {
            success: true,
            message: "Thank you for your inquiry! We'll get back to you shortly.",
        };
    } catch (error) {
        console.error("Error sending email:", error);
        return {
            success: false,
            error: "Failed to send message. Please try again later.",
        };
    }
}
