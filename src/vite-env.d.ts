/// <reference types="vite/client" />

interface User{
    id: number,
    user_id: string,
    full_name: string,
    friends:string[],
    pfp: string,
    date_joined: string
}

interface Month{
    name: string,
    num: string
}
