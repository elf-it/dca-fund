import { type BaseError, useAccount, useReadContracts } from 'wagmi'
import { readContract } from 'wagmi/actions'
import { staking } from '@/abi/abi'
import { bscTestnet as net } from 'wagmi/chains'
import { config } from '@/config'
import { formatEther } from 'viem'
import { useEffect, useState } from 'react'

const formatter = new Intl.NumberFormat('en', {
  //style: 'currency',
  //currency: 'USDT'
});

function Statistic() {
  const { address } = useAccount()
  const [allAccrued, setAllAccrued] = useState(0)

  const allAccruedContract = async () => {
    const payPeriods3 = await readContract(config, {
      abi: staking,
      address: import.meta.env.VITE_CONTRACT,
      functionName: 'payPeriods',
      args: [BigInt(3)],
      chainId: net.id,
    })
    const payPeriods6 = await readContract(config, {
      abi: staking,
      address: import.meta.env.VITE_CONTRACT,
      functionName: 'payPeriods',
      args: [BigInt(6)],
      chainId: net.id,
    })
    const payPeriods9 = await readContract(config, {
      abi: staking,
      address: import.meta.env.VITE_CONTRACT,
      functionName: 'payPeriods',
      args: [BigInt(9)],
      chainId: net.id,
    })
    const payPeriods12 = await readContract(config, {
      abi: staking,
      address: import.meta.env.VITE_CONTRACT,
      functionName: 'payPeriods',
      args: [BigInt(12)],
      chainId: net.id,
    })
    
    let amount = 0
    const countUsers = await readContract(config, {
      abi: staking,
      address: import.meta.env.VITE_CONTRACT,
      functionName: 'countUsers',
      chainId: net.id,
    })
    for (let i = 1; i <= Number(countUsers); i++) {
      const idToUser = await readContract(config, {
        abi: staking,
        address: import.meta.env.VITE_CONTRACT,
        functionName: 'idToUser',
        args: [BigInt(i)],
        chainId: net.id,
      })
      const getUser = await readContract(config, {
        abi: staking,
        address: import.meta.env.VITE_CONTRACT,
        functionName: 'getUser',
        args: [idToUser],
        chainId: net.id,
      })
      for (let k = 0; k < getUser.length; k++) {
        const getUserAmount = await readContract(config, {
          abi: staking,
          address: import.meta.env.VITE_CONTRACT,
          functionName: 'getUserAmount',
          args: [idToUser, BigInt(k)],
          chainId: net.id,
        })
        if(Number(getUser[k].period) == 3){
          if(Number(payPeriods3) > Number(getUser[k].withdrawnTime)){
            const day = (Number(payPeriods3) - Number(getUser[k].withdrawnTime)) / import.meta.env.VITE_SECONDS_DELAY
            if(day >= 1){
              let sum = parseInt(day.toString()) * (parseFloat(formatEther(getUser[k].investedAmount)) / 100 * 0.2)
              amount += sum
            }
          }
        }else if(Number(getUser[k].period) == 6){
          if(Number(payPeriods6) > Number(getUser[k].withdrawnTime)){
            const day = (Number(payPeriods6) - Number(getUser[k].withdrawnTime)) / import.meta.env.VITE_SECONDS_DELAY
            if(day >= 1){
              let sum = parseInt(day.toString()) * (parseFloat(formatEther(getUser[k].investedAmount)) / 100 * 0.26)
              amount += sum
            }
          }
        }else if(Number(getUser[k].period) == 9){
          if(Number(payPeriods9) > Number(getUser[k].withdrawnTime)){
            const day = (Number(payPeriods9) - Number(getUser[k].withdrawnTime)) / import.meta.env.VITE_SECONDS_DELAY
            if(day >= 1){
              let sum = parseInt(day.toString()) * (parseFloat(formatEther(getUser[k].investedAmount)) / 100 * 0.3)
              amount += sum
            }
          }
        }else if(Number(getUser[k].period) == 12){
          const day = (Number(payPeriods12) - Number(getUser[k].withdrawnTime)) / import.meta.env.VITE_SECONDS_DELAY
            if(day >= 1){
              let sum = parseInt(day.toString()) * (parseFloat(formatEther(getUser[k].investedAmount)) / 100 * 0.36)
              amount += sum
            }
        }
      }
    }
    setAllAccrued(amount)
  }

  const { data, error, isPending } = useReadContracts({
    contracts: [{ 
      abi: staking,
      address: import.meta.env.VITE_CONTRACT,
      functionName: 'allAmoutInStaking',
      chainId: net.id,
    }, { 
      abi: staking, 
      address: import.meta.env.VITE_CONTRACT,
      functionName: 'allWithdrawn', 
      chainId: net.id,
    }]
  })
  const [allAmoutInStaking, allWithdrawn] = data || []

  useEffect(() => {
    allAccruedContract()
  }, [])

  return (
    <div className="element-background flex max-[787px]:flex-col  max-[1440px]:flex-row max-[1440px]:justify-evenly flex-col gap-[15px] items-center justify-between h-full">
      <div>
        <p className="text-[44px] text-white font-[700] mb-[-10px]">
          {isPending ?
            "0"
          : 
            <>
              {error ?
                <>
                  {(error as BaseError).shortMessage || error.message}
                </>
              :
              <>
                {formatter.format(parseFloat(formatEther(allAmoutInStaking?.result)))}
              </>
              }
            </>
          }
        </p>
        <p className="text-[16px] text-[#8296A4] font-[600]">
          Всего застекировано
        </p>
      </div>

      <div>
        <p className="text-[44px] text-white font-[700] mb-[-10px]">
        {isPending ?
            "0"
          : 
            <>
              {error ?
                <>
                  {(error as BaseError).shortMessage || error.message}
                </>
              :
              <>
                {formatter.format(allAccrued)}
              </>
              }
            </>
          }
        </p>
        <p className="text-[16px] text-[#8296A4] font-[600]">Всего начислено</p>
      </div>

      <div>
        <p className="text-[44px] text-white font-[700] mb-[-10px]">
        {isPending ?
            "0"
          : 
            <>
              {error ?
                <>
                  {(error as BaseError).shortMessage || error.message}
                </>
              :
              <>
                {formatter.format(parseFloat(formatEther(allWithdrawn?.result)))}
              </>
              }
            </>
          }
        </p>
        <p className="text-[16px] text-[#8296A4] font-[600]">Всего выведено</p>
      </div>
    </div>
  );
}

export default Statistic;
