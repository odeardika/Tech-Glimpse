import validator from 'email-validator';
import { addUserEmail } from '@/modules/supabase/server';

export async function POST(req : Request) {
    const Request = await req.json();

    const email = Request.email;
    if(!email) {
        return Response.json({
            status : 400,
            message : "Failed to get email"
        })
    }

    // check email format 
    if (!validator.validate(email)) {
        return Response.json({
            status : 400,
            message : "Invalid email format"
        })
    }

    // Save email into database
    const info = await addUserEmail(email);

    return Response.json(info);

}