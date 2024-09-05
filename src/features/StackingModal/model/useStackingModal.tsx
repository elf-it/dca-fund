import { useRef, useState } from "react";
import IError from "@/app/interfaces";

import { type BaseError, useAccount, useReadContracts } from 'wagmi'
import { usdt, staking } from '@/abi/abi'
import { bscTestnet } from 'wagmi/chains'
import { formatEther, parseEther } from 'viem'
import { waitForTransactionReceipt, writeContract } from 'wagmi/actions';
import { config } from '@/config'

export default function useStackingModal() {
  const inputRef = useRef(null);
  const [value, setValue] = useState("");
  const [period, setPeriod] = useState(3);
  const [error, setError] = useState<IError[]>([]);

  const checkValidInput = (val: string) => {
    const  pattern = /^\d+\.?\d*$/;
    return pattern.test(val);
  };

  const { address } = useAccount()

  const { data, error: contractError, isPending } = useReadContracts({
    contracts: [{ 
      abi: usdt,
      address: '0x46C6186573aeD71e6A0C445073cD14dDD47ddA5a',
      functionName: 'balanceOf',
      args: [address || null],
      chainId: bscTestnet.id,
    }
    ]
  })
  const [balanceOf] = data || []

  const write = async () => {
    const result = await writeContract(config, {
      abi: usdt,
      address: '0x46C6186573aeD71e6A0C445073cD14dDD47ddA5a',
      functionName: 'approve',
      args: ["0xad0B755F4a89966a0954bE6B1Bea59D800c6D09C", parseEther(value)],
    })

    const transactionReceipt = await waitForTransactionReceipt(config, {
     chainId: bscTestnet.id, 
     hash: result,
    })

    console.log(transactionReceipt.status)
    if(transactionReceipt.status == "success"){
      const buy = await writeContract(config, {
        abi: staking,
        address: '0xad0B755F4a89966a0954bE6B1Bea59D800c6D09C',
        functionName: 'addToPool',
        args: [parseEther(value), BigInt(period)],
      })

      const transactionReceiptBuy = await waitForTransactionReceipt(config, {
        chainId: bscTestnet.id, 
        hash: buy,
      })

      if(transactionReceiptBuy.status == "success"){
        alert("успешно")
      }else{
        alert("ошибка")
      }
    }else{
      console.log("error")
    }
  }

  const onHandleClick = () => {
    setError([]);
    if (!checkValidInput(value)) {
      setError((prev) => [
        ...prev,
        {
          id: 1,
          message: "Необходимо ввести число",
        },
      ]);
      return;
    }
    setError([]);

    if(formatEther(balanceOf?.result) >= value){
      //alert(value + " : " + period);
      write()
    }else{
      alert("Недостаточно USDT");
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
  };
}
