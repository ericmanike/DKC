import { Resend } from 'resend';

const resendSecret = process.env.RESEND_API_KEY;

if (!resendSecret) {
    console.warn("RESEND_API_KEY is not defined in environment variables. Email sending will fail.");
}

export const resend = new Resend(resendSecret);

export const sendEmail = async ({ to, subject, component }: { to: string, subject: string, component: React.ReactElement }) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'DKC BOOKS info@dkcbooksandcourses.com', // Change to your verified domain in production
            to,
            subject,
            react: component,
        });

        if (error) {
            console.error("Resend error:", error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (err) {
        console.error("Email sending failed:", err);
        return { success: false, error: err };
    }
};
