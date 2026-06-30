const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOtpEmail = async (email, otp) => {
    const { data, error } = await resend.emails.send({
        from: 'Loyalty System <onboarding@resend.dev>',
        to: email,
        subject: 'Kode OTP Verifikasi Akun',
        html: `
            <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto;">
                <h2>Verifikasi Akun</h2>
                <p>Gunakan kode OTP berikut untuk menyelesaikan pendaftaran:</p>
                <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center; padding: 16px; background: #f4f4f4; border-radius: 8px;">
                    ${otp}
                </div>
                <p style="color: #888; font-size: 12px; margin-top: 16px;">Kode berlaku selama 10 menit. Jangan bagikan kode ini kepada siapapun.</p>
            </div>
        `,
    });
    if (error) throw { statusCode: 500, message: `Gagal kirim email: ${error.message}` };
};

module.exports = { sendOtpEmail };
