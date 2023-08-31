import { supabase } from "../supabaseClient"
import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "../components/layout";

export default function User<FC>(){
    const nav = useNavigate();
    const [user, setUser]:any = useState({});

    supabase.auth.onAuthStateChange(async(event) => {
        if(event === "SIGNED_IN")
            nav("/chat");
    })

    useEffect(() => {
        getUser();
    }, [])

    async function getUser(){
        await supabase.auth.getUser().then((val) => {
            if(val.data?.user){
                setUser(val.data.user);
            }
        });
    }

    async function logOut(){
        const {error} = await supabase.auth.signOut();
        if(error) throw error;
        else window.location.reload();
    }

    if(Object.keys(user).length == 0){
        return(
            <Layout>
                <div className="flex w-full h-fullScreen debug justify-center items-center">
                    <div className="w-1/3">
                        <Auth supabaseClient={supabase} appearance={{theme: ThemeSupa}} theme="dark" />
                    </div>
                </div>
            </Layout>
        )
    } else {
        return(
            <Layout>
                <h1>Sucess</h1>
                <button onClick={() => logOut()}>Sign out</button>
            </Layout>
        )
    }
}