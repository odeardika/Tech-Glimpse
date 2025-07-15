import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string);

export async function getUserEmail () {
    const { data, error } = await supabase.from('usersEmail')
    .select('email,isDelete');

    if (error) {
        return JSON.stringify(error);
    }

    let listEmail = ""
    data.forEach(user => {
        if(!user.isDelete) {
            listEmail += `${user.email}, `;
        }
    })

    return listEmail;
}

export async function removeUserEmail (email : string) {
    const { data, error } = await supabase.from('usersEmail').delete().eq('email',email).select();

    if (error) {
        return error;
    }
    else {
        return data;
    }
}

export async function addUserEmail(email : string) {
    const { data, error } = await supabase.from('usersEmail')
    .insert({
        email : email
    }).select();

    if (error) {
        return error
    }
    return data;
}

export async function DeactivateUser(id:number) {
    const { data, error } = await supabase.from('usersEmail')
    .update({ isDelete: true })
    .eq('id', id)
    .select();

    if(error) {
        return error;
    }
    return data;
}

export async function activeAddDatabases () {
    const { data, error } = await supabase.from('usersEmail').insert([
        {email : "updateemail@gmail.com", id : 0}
    ]).select();

    if(error) {
        return error;
    }
    return data;
}

export async function activeDeleteDatabases() {
    const {data, error} = await supabase.from('usersEmail').delete().eq('id', 0).select();
    
    if(error) {
        return error;
    }
    return data;
}