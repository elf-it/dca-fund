import { type BaseError, useAccount, useReadContracts } from 'wagmi'
import { staking } from '@/abi/abi'
import { bscTestnet } from 'wagmi/chains'
import { formatEther } from 'viem'

const formatter = new Intl.NumberFormat('en', {
  //style: 'currency',
  //currency: 'USDT'
});

function Statistic() {
  const { address } = useAccount()

  const { data, error, isPending } = useReadContracts({
    contracts: [{ 
      abi: staking,
      address: '0xad0B755F4a89966a0954bE6B1Bea59D800c6D09C',
      functionName: 'allAmoutInStaking',
      chainId: bscTestnet.id,
    }, { 
      abi: staking, 
      address: '0xad0B755F4a89966a0954bE6B1Bea59D800c6D09C',
      functionName: 'allAccrued', 
      chainId: bscTestnet.id,
    }, { 
      abi: staking, 
      address: '0xad0B755F4a89966a0954bE6B1Bea59D800c6D09C',
      functionName: 'allWithdrawn', 
      chainId: bscTestnet.id,
    }]
  })
  const [allAmoutInStaking, allAccrued, allWithdrawn] = data || []

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
                {formatter.format(parseFloat(formatEther(allAccrued?.result)))}
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
