import { Resend } from 'resend';
import { env } from '$env/dynamic/private';

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

export async function sendOTPEmail({ to, otp }: { to: string; otp: string }): Promise<void> {
	if (!resend) {
		console.warn(`[email] RESEND_API_KEY not set — OTP for ${to}: ${otp}`);
		return;
	}

	const from = env.EMAIL_FROM || 'onboarding@resend.dev';

	const { data, error } = await resend.emails.send({
		from,
		to,
		subject: 'Your Eye Creatures sign-in code',
		html: `
			<div style="font-family: system-ui, -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #111;">
				<h1 style="font-size: 20px; margin: 0 0 16px;">Your one-time code</h1>
				<p style="margin: 0 0 24px; color: #444;">Enter this code to finish signing in. It expires in 5 minutes.</p>
				<p style="font-size: 32px; font-weight: 700; letter-spacing: 6px; text-align: center; background: #f4f4f5; padding: 16px; border-radius: 8px; margin: 0 0 24px;">${otp}</p>
				<p style="font-size: 13px; color: #777; margin: 0;">If you didn't request this, you can safely ignore this email.</p>
			</div>
		`
	});

	if (error) {
		console.error(`[email] Resend failed to send OTP to ${to}:`, error);
		throw new Error(`Failed to send sign-in code: ${error.message}`);
	}

	console.log(`[email] OTP sent to ${to} (Resend id: ${data?.id})`);
}
