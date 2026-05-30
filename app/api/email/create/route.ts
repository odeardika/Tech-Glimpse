import validator from 'email-validator';
import { addUserEmail } from '@/modules/sheets/server';
import { sendWelcomeEmail } from '@/modules/email/welcome';

export async function POST(req: Request): Promise<Response> {
    const body = await req.json();
    const email: string = body.email;

    if (!email) {
        return Response.json({ error: "Email is required" }, { status: 400 });
    }

    if (!validator.validate(email)) {
        return Response.json({ error: "Invalid email format" }, { status: 400 });
    }

    try {
        await addUserEmail(email);
        // fire-and-forget welcome email — don't block subscribe response
        sendWelcomeEmail(email).catch((err) =>
            console.error("[welcome-email]", err)
        );
        return Response.json({ success: true });
    } catch (err) {
        if (err instanceof Error && err.message === "DUPLICATE_EMAIL") {
            return Response.json({ error: "Email already subscribed" }, { status: 409 });
        }
        console.error("[email/create]", err);
        return Response.json({ error: "Failed to subscribe" }, { status: 500 });
    }
}
