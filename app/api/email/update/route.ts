import { DeactivateUser, activeAddDatabases, activeDeleteDatabases } from "@/modules/supabase/server";

export async function PUT () {
    // deactivate spesific user to keep database active
    const res = await DeactivateUser(15);
    activeAddDatabases();
    activeDeleteDatabases();

    return Response.json(res);
}