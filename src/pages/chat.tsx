import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import Layout from "../components/layout";
import { useNavigate } from "react-router-dom";
import Loading from "../components/loading";

interface Chat{
    id: number,
    msg: string,
    sent_by: string,
    sent_to: string
}

interface User{
    id: number,
    user_id: string,
    first_name: string,
    last_name:string,
    friends:string[],
    pfp: string
}

export default function Chat(){
    const nav = useNavigate();

    const [user, setUser] = useState<User>({id: -1, user_id: "", first_name: "", last_name: "", friends: [], pfp: ""});
    const [currentFriend, setFriend] = useState<User>({id: -1, user_id: "", first_name: "", last_name: "", friends: [], pfp: ""});

    const [chats, setChats] = useState<Chat[]>([]);
    const [friends, setFriends] = useState<User[]>([]);

    const [msg, setMsg] = useState("");
    const [uuid, setUuid] = useState("");

    let tempFriends:string[] = [];
  
    useEffect(() => {
        getUser();
    }, []);

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

    return(
        <Layout>
            <div className="flex h-fullScreen">
                <aside className="w-1/6 border-r-2 border-slate-50">
                    <section className="border-b-1 flex items-center">
                        <h2 className="flex flex-grow">Friends</h2>
                        {/* <button className="flex w-fit h-fit mr-2 group rounded-full p-1.5 shadow-sm transition-all duration-150 ease-in hover:scale-[1.075] hover:bg-zinc-700 hover:shadow-md hover:shadow-green-400/25">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 transition-color delay-75 duration-150 ease-in group-hover:text-green-400">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                            </svg>
                        </button> */}
                    </section>
                    <ul className="divide-y-1 divide-slate-700">
                        {friends.length === 0 ?
                            <Loading />
                        :
                            friends.map((friend:User) => (
                                <li className="text-xl flex justify-center items-center px-2 py-1.5">
                                    <div className="flex flex-grow items-center">
                                        <img src={friend.pfp} alt="This user's profile picture" className="w-8 h-8 rounded-full" />
                                        <span>{friend.first_name} {friend.last_name}</span>
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
                    <ol className="flex flex-col-reverse flex-grow px-2">
                        {chats.map((chat:Chat) => (
                            <li className="text-lg">
                                {chat.sent_by === uuid ? 
                                    <div>
                                        <span className="text-green-400">{user.first_name}</span>
                                        <span>: {chat.msg}</span>
                                    </div>
                                :
                                    <div>
                                        <span className="text-cyan-400">{currentFriend.first_name}</span>
                                        <span>: {chat.msg}</span>
                                    </div>
                                }
                            </li>
                        ))}
                    </ol>
                    <section className="self-end flex w-full px-4 py-2">
                        <input type="text" name="msg" required value={msg} onChange={(e) => setMsg(e.target.value)} className="flex flex-grow bg-slate-700 rounded-l-md px-1" />
                        <button onClick={() => createChat()} className="bg-slate-700 rounded-r-md px-1.5 py-0.5 group">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 transition-color duration-150 ease-in group-hover:text-green-400">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                        </button>
                    </section>
                </main>
            </div>
        </Layout>
    )
}