import { useState } from "react"


export const useLoader = () => {
  const [loading, setLoading] = useState(false)
  
  const withLoading = async(asyncFn)=>{
    try{
      setLoading(true)
      await asyncFn()
    } finally{
      setLoading(false)
    }
  }
  return {loading, withLoading}
}
