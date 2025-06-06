export async function GET() {
    return new Response(JSON.stringify({
        message: "running"
    }), {
        headers: { "Content-Type": "application/json" }
    });
}