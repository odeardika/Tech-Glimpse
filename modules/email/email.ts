import nodemailer from 'nodemailer';
import News from "@/types/News";
import emailTemplate from "@/templates/newsMessage";


const sendEmail = async (
    article: News[], 
    usersEmail : string, 
    authUser : {
        user: string,
        pass: string
    }

) => {
    const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: authUser.user,
        pass: authUser.pass
    },
    });
    const info = await transporter.sendMail({
        from: 'Tech Glimpse Newslatter',
        to: usersEmail,
        subject: "Daily Newslatter",
        html: emailTemplate(article)
    })

    return info
}

export default sendEmail;
