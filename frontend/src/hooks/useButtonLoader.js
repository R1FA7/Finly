import { useState } from "react"

export const useButtonLoader = () => {
  const [btnLoadingMap, setBtnLoadingMap] = useState({})

  const setBtnLoading = (key, isBtnLoading) =>{
    setBtnLoadingMap((prev)=>({
      ...prev,
      [key]: isBtnLoading
    }))
  }

  const withBtnLoading = async (key, asyncFn) =>{
    setBtnLoading(key, true) 
    try{
      await asyncFn()
    } finally{
      setBtnLoading(key, false)
    }
  }

  return {btnLoadingMap, withBtnLoading}
}