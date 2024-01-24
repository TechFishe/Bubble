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