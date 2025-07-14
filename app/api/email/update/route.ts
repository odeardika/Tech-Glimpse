import { DeactivateUser, activeDatabases } from "@/modules/supabase/server";

export async function PUT () {
    // deactivate spesific user to keep database active
    const res = await DeactivateUser(15);
    activeDatabases();

    return Response.json(res);
}