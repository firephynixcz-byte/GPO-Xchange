import { Resend } from 'resend';
import WelcomeEmail from '@/lib/emails/WelcomeEmail'; // ตรวจสอบ Path ให้ตรงกับที่กิตวางไฟล์ไว้นะครับ

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    // 1. รับค่าที่ส่งมาจาก RegisterForm
    const { email, hospitalName } = await req.json();

    // 2. สั่ง Resend ส่งอีเมล
    const data = await resend.emails.send({
      from: 'GPO Xchange <onboarding@resend.dev>', // ใช้โดเมนทดสอบไปก่อนครับ
      to: [email],
      subject: 'คำขอลงทะเบียนของท่านได้รับแล้ว',
      react: WelcomeEmail({ hospitalName }), 
    });

    // 3. ส่งผลตอบกลับไปที่หน้าบ้าน (Frontend)
    return Response.json({ success: true, data });
  } catch (error) {
    console.error('Error sending email:', error);
    return Response.json({ error: 'Failed to send email' }, { status: 500 });
  }
}