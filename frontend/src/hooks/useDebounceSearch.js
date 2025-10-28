import { useEffect, useState } from "react";

export const useDebounceSearch = ({value, delay=1000}) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(()=>{
    const tId = setTimeout(()=>setDebouncedValue(value),delay)
    return ()=> clearTimeout(tId)
  },[value, delay])

  return debouncedValue
}