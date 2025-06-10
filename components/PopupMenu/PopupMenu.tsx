import { useState } from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogHeader
} from "@/components/ui/dialog";
import axios from "axios";

export default function PopupMenu() {
    const [email, setEmail] = useState("");
    const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    }
    const handleSubcribe = () => {
        axios.post('/api/email/create', {email : email})
        setEmail("");
    }
    
  return (
    <Dialog>
        <DialogTrigger >
            <span className='border-2 hover:border-accent-foreground hover:cursor-pointer py-2 px-4 rounded-md'>Subscribe</span>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Subscribe to our Newsletter</DialogTitle>
                <DialogDescription>
                    Get the latest technology news delivered to your inbox every day.
                </DialogDescription>
                <form className="flex flex-col gap-4 mt-4">
                    <input type="email" placeholder="Enter your email" value={email} onChange={onChangeHandler} className="p-2 border rounded" required />
                    <button onClick={handleSubcribe} 
                    type="submit" 
                    className="bg-blue-500 text-white p-2 rounded hover:cursor-pointer">Subscribe</button>
                </form>
            </DialogHeader>
        </DialogContent>
    </Dialog>
  )
}
