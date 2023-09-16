import { supabase } from "../supabaseClient";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../components/layout";
import Loading from "../components/loading";

interface Chat{
    id: number,
    msg: string,
    sent_by: string,
    sent_to: string
}

export default function Chat(){
    //#region Vars
    const nav = useNavigate();

    const [user, setUser] = useState<User>({id: -1, user_id: "", full_name: "", friends: [], pfp: "", date_joined: ""});
    const [currentFriend, setFriend] = useState<User>({id: -1, user_id: "", full_name: "", friends: [], pfp: "", date_joined: ""});

    const [chats, setChats] = useState<Chat[]>([]);
    const [friends, setFriends] = useState<User[]>([]);

    const [msg, setMsg] = useState("");
    const [uuid, setUuid] = useState("");

    let tempFriends:string[] = [];
    //#endregion
  
    //#region Functions
    useEffect(() => {
        async function getUser(){
            await supabase.auth.getUser().then((val) => {
                if(val.data?.user){
                    setCurrentUser(val.data.user.id);
                    getTempFriends(val.data.user.id);
                } else{
                    nav("/user");
                }
            });
        }
    
        async function setCurrentUser(uuid:string){
            const {data, error} = await supabase.from("users").select().eq("user_id", uuid).single();
            if(error) throw error;
            else setUser(data)
        }
    
        async function getTempFriends(uuid:string) {
            const {data, error} = await supabase.from("users").select("friends").eq("user_id", uuid).single();
            if(error) throw error;
            else{
                setUuid(uuid);
                tempFriends = JSON.parse(JSON.stringify(data.friends))
                getFinalFriends();
            }
        }
    
        async function getFinalFriends() {
            const {data, error} = await supabase.from("users").select().in("user_id", tempFriends);
            if(error) throw error;
            else setFriends(data)
        }

        getUser();
    }, []);

    async function getChats(friendId:string, fromAside:boolean) {
        const tempArray:string[] = [uuid, friendId];
        const {data, error} = await supabase.from("chats").select().in("sent_by", tempArray).in("sent_to", tempArray).order("id", {ascending: false});
        if(error) throw error;
        else{
            if(fromAside) getCurrentFriend(friendId)
            setChats(data);
        }
    }

    async function getCurrentFriend(friendId:string){
        const {data, error} = await supabase.from("users").select().eq("user_id", friendId).single();
        if(error) throw error;
        else setFriend(data);
    }

  
    async function createChat(){
        const {error} = await supabase.from("chats").insert({msg: msg, sent_by: uuid, sent_to: currentFriend.user_id}).single();
        if(error) throw error;
        else{
            setMsg("");
            getChats(currentFriend.user_id, false)
        }
    }
    //#endregion

    //#region JSX
    return(
        <Layout>
            <div className="flex h-fullScreen">
                <aside className="2xl:w-1/6 sm:w-1/3 w-0 border-r-2 border-slate-50">
                    <h2>Friends</h2>
                    <ul className="divide-y-1 divide-slate-700">
                        {friends.length === 0 ?
                            <div className="mt-4">
                                <Loading />
                            </div>
                        :
                            friends.map((friend:User) => (
                                <li className="text-xl flex justify-center items-center px-2 py-1.5">
                                    <div className="flex flex-grow items-center">
                                        <img src={friend.pfp} alt="This user's profile picture" className="w-8 h-8" />
                                        <a href="" className="hover:underline">
                                            <span>{friend.full_name}</span>
                                        </a>
                                    </div>
                                    <button onClick={() => getChats(friend.user_id, true)} className="group rounded-full flex p-0.5 shadow-sm hover:shadow-md hover:shadow-green-400/25 hover:bg-zinc-700 hover:scale-110 transition-all duration-150 ease-in">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="transition-color h-6 w-6 delay-75 duration-150 ease-in group-hover:text-green-400">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                        </svg>
                                    </button>
                                </li>
                            ))
                        }
                    </ul>
                </aside>
                <main className="w-5/6 h-full flex flex-col">
                    { currentFriend.id !== -1 ?
                        <article className="flex items-end w-full">
                            <img src={currentFriend.pfp} alt="Friend profile picture" />
                            <a href="" className="h-fit hover:underline">
                                <h2>{currentFriend.full_name}</h2>
                            </a>
                        </article>
                    :
                        <></>
                    }
                    <ol className="flex flex-col-reverse flex-grow px-2">
                        {chats.map((chat:Chat) => (
                            <li className="text-lg">
                                {chat.sent_by === uuid ? 
                                    <div>
                                        <span className="text-green-400">{user.full_name.split(" ")[0]}</span>
                                        <span>: {chat.msg}</span>
                                    </div>
                                :
                                    <div>
                                        <span className="text-cyan-400">{currentFriend.full_name.split(" ")[0]}</span>
                                        <span>: {chat.msg}</span>
                                    </div>
                                }
                            </li>
                        ))}
                    </ol>
                    <section className="self-end flex w-full px-4 py-2">
                        <input type="text" name="msg" required value={msg} onChange={(e) => setMsg(e.target.value)} className="flex flex-grow bg-slate-700 rounded-l-md px-1" />
                        <button onClick={() => createChat()} disabled={msg === ""} className="bg-slate-700 rounded-r-md px-1.5 py-0.5 group">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 transition-color duration-150 ease-in group-hover:text-green-400">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                        </button>
                    </section>
                </main>
            </div>
        </Layout>
    )
    //#endregion
}