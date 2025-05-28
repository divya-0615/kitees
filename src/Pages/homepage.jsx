import React, { useEffect } from 'react';
import { toast, Toaster } from "react-hot-toast";

export default function Homepage() {
    useEffect(() => {
        toast.success("Please Wait..!");
    }, []);

    return (
        <div style={{ textAlign: "center" }}>
            <Toaster />
            <br /><br />kitees an official website for electronics students.<br />
            kitees.vercel.app is an ecommarce for Electronics components and kits.
            <br />This website is under development. <br />
        </div>
    );
}
