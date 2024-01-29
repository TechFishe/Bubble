import { defineStore } from "pinia";

export const useAlertStore = defineStore('alertStore', {
    state: () => {
        return{
            msg: "",
            type: "",
            timesShown: 0
        }
    }
});

export const useUserStore = defineStore('userStore', {
    state: () => {
        return{
            id: 0,
            user_id: "",
            full_name: "",
            friends: [],
            pfp: "",
            date_joined: ""
        }
    }
});