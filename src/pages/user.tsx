import { supabase } from "../supabaseClient"

// import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Layout from "../components/layout";
import Loading from "../components/loading";

import { createAvatar } from '@dicebear/core';
import { micah } from '@dicebear/collection';

export default function User(){
    //#region Vars
    // const nav = useNavigate();
    const [customUser, setCustomUser] = useState<User>({id: -1, user_id: "", full_name: "", friends: [], pfp: ""});
    const [friends, setFriends] = useState<User[]>([]);

    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [passConfirm, setPassConfirm] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const [newUser, setNewUser] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [isFindingFriends, setFindingFriends] = useState(false);
    const [isSettings, setSettings] = useState(false);

    let tempFriends:string[] = [];
    //#endregion

    //#region Functions
    // supabase.auth.onAuthStateChange(async(event) => {
    //     if(event === "SIGNED_IN")
    //         nav("/chat");
    // })

    useEffect(() => {
        getUser();
    }, [])

    async function getUser(){
        await supabase.auth.getUser().then((val) => {
            if(val.data?.user){
                getCustomUser(val.data.user.id);
                getTempFriends(val.data.user.id)
            }
            else setLoading(false);
        });
    }

    async function getCustomUser(uuid:string){
        const {data, error} = await supabase.from("users").select().eq("user_id", uuid).single();
        if(error) throw error;
        else setCustomUser(data);
    }

    async function getTempFriends(uuid:string) {
        const {data, error} = await supabase.from("users").select("friends").eq("user_id", uuid).single();
        if(error) throw error;
        else{
            tempFriends = JSON.parse(JSON.stringify(data.friends))
            getFinalFriends();
        }
    }

    async function getFinalFriends() {
        const {data, error} = await supabase.from("users").select().in("user_id", tempFriends);
        if(error) throw error;
        else{
            setFriends(data);
            setLoading(false);
        }
    }

        //#region User Auth 
    async function logInWithEmail(){
        const {error} = await supabase.auth.signInWithPassword({email, password: pass});
        if(error) throw error
        else getUser();
    }

    async function signUpWithEmail(){
        const {data, error} = await supabase.auth.signUp({ email, password: pass});
        if(error) throw error
        else if(data.user) createNewUser(data.user?.id); //Ignore error
    }

    async function createNewUser(uuid:string){
        const {error} = await supabase.from("users").insert({user_id: uuid, first_name: firstName, last_name: lastName, friends: [], pfp : createAvatar(micah, {size:64, seed: uuid}).toDataUriSync()});
        if(error) throw error
    }

    // async function logOut(){
    //     const {error} = await supabase.auth.signOut();
    //     if(error) throw error;
    //     else window.location.reload();
    // }
    //#endregion

    //#endregion

    //#region JSX
    if(Object.keys(customUser).length === 0 && !isLoading){
        return(
            <Layout>
                <main className="flex w-full h-fullScreen justify-center items-center">
                    {!newUser ?
                        <section className="w-1/3 flex flex-col space-y-4">
                            <div className="flex flex-col">
                                <label htmlFor="email" className="text-lg ml-2 text-green-400">Email</label>
                                <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-md h-10 text-lg px-4 py-0.5 bg-slate-700" />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="pass" className="text-lg ml-2 text-green-400">Password</label>
                                <input type="password" name="pass" value={pass} onChange={(e) => setPass(e.target.value)} className="rounded-md h-10 text-lg px-4 py-0.5 bg-slate-700" />
                            </div>
                            <p className="text-center">New to Bubble? Sign up <button className="underline transition-colors duration-150 ease-in hover:text-green-400" onClick={() => setNewUser(true)}>Here</button>.</p>
                            <button onClick={() => logInWithEmail()} disabled={pass === ""} className="group text-lg flex w-fit self-center px-4 py-1 rounded-md shadow-sm bg-transparent hover:shadow-md hover:bg-slate-700 hover:shadow-green-400/25 transition-all duration-150 ease-in hover:scale-[1.075]">
                                <span className="transition-color delay-75 duration-150 ease-in group-hover:text-green-400">Login</span>
                            </button>
                        </section>
                    :
                        <section className="w-1/3 flex flex-col space-y-4">
                            <div className="flex flex-col">
                                <label htmlFor="email" className="text-lg ml-2 text-green-400">Email</label>
                                <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-md h-10 text-lg px-4 py-0.5 bg-slate-700" />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="pass" className="text-lg ml-2 text-green-400">Password</label>
                                <input type="password" name="pass" value={pass} onChange={(e) => setPass(e.target.value)} className="rounded-md h-10 text-lg px-4 py-0.5 bg-slate-700" />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="passConfirm" className="text-lg ml-2 text-green-400">Confirm Password</label>
                                <input type="password" name="passConfirm" value={passConfirm} onChange={(e) => setPassConfirm(e.target.value)} className="rounded-md h-10 text-lg px-4 py-0.5 bg-slate-700" />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="firstName" className="text-lg ml-2 text-green-400">First Name</label>
                                <input type="text" name="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="rounded-md h-10 text-lg px-4 py-0.5 bg-slate-700" />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="lastName" className="text-lg ml-2 text-green-400">Last Name</label>
                                <input type="text" name="lastname" value={lastName} onChange={(e) => setLastName(e.target.value)} className="rounded-md h-10 text-lg px-4 py-0.5 bg-slate-700" />
                            </div>
                            <button onClick={() => signUpWithEmail()} disabled={pass !== passConfirm || (pass === "" || passConfirm === "")} className="group text-lg flex w-fit self-center px-4 py-1 rounded-md shadow-sm bg-transparent hover:shadow-md hover:bg-slate-700 hover:shadow-green-400/25 transition-all duration-150 ease-in hover:scale-[1.075]">
                                <span className="transition-color delay-75 duration-150 ease-in group-hover:text-green-400">Sign up</span>
                            </button>
                        </section>
                    }
                </main>
            </Layout>
        )
    } else if(Object.keys(customUser).length !== 0 && !isLoading){
        return(
            <Layout>
                <div className="flex w-screen">
                    <main className="w-1/2">
                        <section className="flex w-fit border-b-2">
                            <img src={customUser.pfp} alt="User's profile picture" width={128} height={128} className="rounded-md" />
                            <div className="flex flex-col">
                                <article>
                                    <h2>{customUser.full_name}</h2>
                                    <p className="text-lg">User since: <span className="text-green-400"></span></p>
                                </article>
                                <section className="flex flex-grow items-center space-x-4 px-4">
                                    <button onClick={() => {setSettings(true); setFindingFriends(false);}} className="flex w-fit h-fit mr-2 group rounded-full p-1.5 shadow-sm transition-all duration-150 ease-in hover:scale-[1.075] hover:bg-zinc-700 hover:shadow-md hover:shadow-green-400/25">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 transition-color delay-75 duration-150 ease-in group-hover:text-green-400">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </button>
                                </section>
                            </div>
                        </section>
                        <section className="w-fit mt-2">
                            <section className="flex items-center">
                                <h3 className="flex flex-grow mr-4">Friends</h3>
                                <button onClick={() => {setSettings(false); setFindingFriends(true);}} className="flex w-fit h-fit mr-2 group rounded-full p-1.5 shadow-sm transition-all duration-150 ease-in hover:scale-[1.075] hover:bg-zinc-700 hover:shadow-md hover:shadow-green-400/25">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 transition-color delay-75 duration-150 ease-in group-hover:text-green-400">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </button>
                            </section>
                            <ul className="divide-y-1 divide-slate-700">
                                {friends.length === 0 ?
                                    <Loading />
                                :
                                    friends.map((friend:User) => (
                                        <li className="text-xl flex justify-start items-center px-2 py-1.5">
                                            <img src={friend.pfp} alt="This user's profile picture" className="w-8 h-8 rounded-full" />
                                            <span>{friend.full_name}</span>
                                        </li>
                                    ))
                                }
                            </ul>
                        </section>
                    </main>
                    <Aside currentUser={customUser} isSettings={isSettings} isFindFriends={isFindingFriends} friends={customUser.friends} />
                </div>
            </Layout>
        )
    } else if(Object.keys(customUser).length === 0 && isLoading){
        return(
            <Layout>
                <main className="flex w-screen h-fullScreen justify-center items-center">
                    <Loading />
                </main>
            </Layout>
        )
    }
    //#endregion
}

interface Props{
    currentUser: User,
    isSettings: boolean,
    isFindFriends: boolean,
    friends: string[]
}

interface FriendList{
    friend: User,
    isAlreadyFriend: boolean;
}

function Aside(props: Props){
    const [possibleFriends, setPossibleFriends] = useState<User[]>([]);
    const [foundFriends, setFoundFriends] = useState<FriendList[]>([]);

    async function findFriends(e:any){
        const {data, error} = await supabase.from("users").select().textSearch("full_name", e.target.value);
        if(error) throw error;
        else{
            setPossibleFriends(data);
            
            let tempArray:FriendList[] = [];
            for(let i = 0; i < data.length; i++){
                tempArray.push({
                    friend: data[i],
                    isAlreadyFriend: data[i].user_id === props.friends[i] ? true : false
                });
            }
            setFoundFriends(tempArray);
        }
    }

    async function addFriend(friendId:string){
        const {error} = await supabase.from("users").update({...props.currentUser, friends: props.friends.push(friendId)}).eq("user_id", props.currentUser.user_id);
        if(error) throw error
    }

    if(props.isSettings){
        return(
            <aside className="w-1/2 h-fullScreeen">
                <h3>Settings</h3>
            </aside>
        )
    } else if(props.isFindFriends){
        return(
            <aside className="w-1/2 h-fullScreeen">
                <div className="flex w-full h-10 items-center">
                    <h3 className="mr-4">Find Friends</h3>
                    <section className="rounded-md flex items-center px-2 w-1/2 h-full overflow-hidden bg-slate-700">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                        <input type="text" name="searchBar" onChange={(e) => findFriends(e)} className="w-full bg-transparent" />
                    </section>
                </div>
                {possibleFriends.length !== 0 ?
                    <ul className="xl:w-1/3">
                        {possibleFriends.map((friend:User) => (
                            <li className="text-xl flex justify-center items-center px-2 py-1.5">
                                <div className="flex flex-grow items-center">
                                    <img src={friend.pfp} alt="This user's profile picture" className="w-8 h-8 rounded-full" />
                                    <span>{friend.full_name}</span>
                                </div>
                                {foundFriends.map((_friend:FriendList) => (
                                    <>
                                        {_friend.isAlreadyFriend ?
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-cyan-400">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                            </svg>
                                        :
                                            <button onClick={() => addFriend(_friend.friend.user_id)} className="group rounded-full flex p-0.5 shadow-sm hover:shadow-md hover:shadow-green-400/25 hover:bg-zinc-700 hover:scale-110 transition-all duration-150 ease-in">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="transition-color h-6 w-6 delay-75 duration-150 ease-in group-hover:text-green-400">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                                </svg>
                                            </button>
                                        }
                                    </>
                                ))}
                            </li>
                        ))}
                    </ul>
                :
                    <section className="flex flex-col items-center w-full mt-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-green-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                        <p className="text-lg px-4 text-center">Type into the search bar to get started. Possible new friends won't appear until you typed a full first name.<br />Type their last name to be even more precise.</p>
                    </section>
                }
            </aside>
        )
    } else return <></> 
}