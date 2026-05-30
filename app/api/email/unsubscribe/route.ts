import { removeUserEmail } from "@/modules/sheets/server";

export async function DELETE(req: Request): Promise<Response> {
    const body = await req.json();
    const email: string = body.email;

    if (!email) {
        return Response.json({ error: "Email is required" }, { status: 400 });
    }

    try {
        await removeUserEmail(email);
        return Response.json({ success: true });
    } catch {
        return Response.json({ error: "Failed to unsubscribe" }, { status: 500 });
    }
}
