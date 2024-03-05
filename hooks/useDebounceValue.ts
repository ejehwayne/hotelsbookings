import { useEffect, useState } from "react";

export function useDebounceValue<T>(value: T, delay?:number): T{

    const[debounceValue, setDebounce]=useState <T>(value)

    useEffect(() => {
        
        const timer = setTimeout(() => setDebounce(value), delay || 300);
         
        return () => {
           clearTimeout(timer) 
        }
    }, [value, delay])
    

    return debounceValue
}