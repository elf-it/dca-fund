import { useContext, useRef, useState } from "react";
import IError from "@/app/interfaces";

import { type BaseError, useAccount, useReadContracts } from 'wagmi'
import { usdt, staking } from '@/abi/abi'
import { bscTestnet as net } from 'wagmi/chains'
import { formatEther, parseEther } from 'viem'
import { waitForTransactionReceipt, writeContract } from 'wagmi/actions';
import { config } from '@/config'
import { Bounce, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { LangContext } from "@/app/context/LangaugeContext";

export default function useStackingModal() {
  const inputRef = useRef(null);
  const [value, setValue] = useState("");
  const [period, setPeriod] = useState(3);
  const [error, setError] = useState<IError[]>([]);
  const [loading,setLoading] = useState(false)
  const {language} = useContext(LangContext)

  const checkValidInput = (val: string) => {
    const  pattern = /^\d+\.?\d*$/;
    return pattern.test(val);
  };

  const { address } = useAccount()

  const { data, error: contractError, isPending } = useReadContracts({
    contracts: [{ 
      abi: usdt,
      address: import.meta.env.VITE_CONTRACT_USDT,
      functionName: 'balanceOf',
      args: [address || null],
      chainId: net.id,
    }
    ]
  })
  const [balanceOf] = data || []

  const write = async () => {
    const result = await writeContract(config, {
      abi: usdt,
      address: import.meta.env.VITE_CONTRACT_USDT,
      functionName: 'approve',
      args: [import.meta.env.VITE_CONTRACT, parseEther(value)],
    })

    const transactionReceipt = await waitForTransactionReceipt(config, {
     chainId: net.id, 
     hash: result,
    })

    if(transactionReceipt.status == "success"){
      const buy = await writeContract(config, {
        abi: staking,
        address: import.meta.env.VITE_CONTRACT,
        functionName: 'addToPool',
        args: [parseEther(value), BigInt(period)],
      })

      const transactionReceiptBuy = await waitForTransactionReceipt(config, {
        chainId: net.id, 
        hash: buy,
      })

      if (transactionReceiptBuy.status === "success") {
        toast.success(language.stacking.success, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
      } else {
        toast.error(language.stacking.error, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
      }
      
    }else{
      console.log("error")
    }
  }

  const onHandleClick = async (cb?:() => void) => {

    setError([]);
    if (!checkValidInput(value) && Number(value) == 0) {
      setError((prev) => [
        ...prev,
        {
          id: 1,
          message: "Необходимо ввести число больше нуля",
        },
      ]);
      return;
    }
    setError([]);
    if(formatEther(balanceOf?.result) >= value){
      //alert(value + " : " + period);
      try{
        setLoading(true)
        await write()
        setLoading(false)
        if(cb){
          cb()
        }
      }catch(e){
        toast.error(language.stacking.notEnoughUsdt, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
      }
    }else{
      setLoading(false)
      toast.error(language.stacking.purchaseError, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }

    setValue("");
    setPeriod(3);
  };

  return {
    inputRef,
    value,
    setValue,
    setPeriod,
    error,
    onHandleClick,
    loading
  };
}
