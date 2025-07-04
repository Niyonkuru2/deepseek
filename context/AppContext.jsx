"use client";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = ()=>{
    return useContext(AppContext)
}
export const AppContextProvider=({children})=>{
    const {user} = useUser()
    const {getToken} = useAuth()
    const [chats,setChats] =useState([]);
    const [selectedChat,setSelectedChat] = useState(null)

    const createNewChat = async()=>{
        try {
           if(!user) return null;
           const token = await getToken();
           await axios.post('/api/chat/create',{},{headers:{
            Authorization:`Bearer ${token}`
           }}) 
           fetchUserChats();
        } catch (error) {
            toast.error(error.message)
        }
    }

    const fetchUserChats = async()=>{
        try {
           if(!user) return null;
           const token = await getToken();
           const {data} = await axios.get('/api/chat/get',{},{headers:{
            Authorization:`Bearer ${token}`
           }}) 
           if(data.success){
            console.log(data.data);
            setChats(data.data);

            //if user has no xhat create one

            if(data.data.length === 0){
                await createNewChat();
                return fetchUserChats();
            }
            else{
                //sort chat by updated date

                data.data.sort((a,b)=>new Date(b.updatedAt) - new Date(a.updatedAt))
            
                //set recent
                setSelectedChat(data.data[0]);

            }
           }else{
            toString.error(data.message)
           }
        } catch (error) {
            toast.error(error.message)
        }
    }
    useEffect(()=>{
        if (user) {
           fetchUserChats(); 
        }
    },[user])
    const value ={
        user,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        fetchUserChats,
        createNewChat
    }
    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}