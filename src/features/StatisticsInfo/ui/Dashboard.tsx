import lang from "@/../lang.json";
import { Table, RowItem } from "@shared/ui/components/Table";
import { Row } from "@shared/ui/components/Table";
import Button from "@shared/ui/components/Button";

import { type BaseError, useAccount, useReadContracts } from 'wagmi'
import { staking } from '@/abi/abi'
import { bscTestnet as net } from 'wagmi/chains'
import { readContract, waitForTransactionReceipt, writeContract } from 'wagmi/actions'
import { config } from '@/config'
import { formatEther, parseEther } from 'viem'
import { useContext, useEffect, useState } from "react";
import { usdt } from "@/abi/abi";
import { LangContext } from "@/app/context/LangaugeContext";
import { Bounce, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const formatter = new Intl.NumberFormat('en', {
  //style: 'currency',
  //currency: 'USDT'
});


const percents = [
  {months: 0, day: 0}, 
  {months: 0, day: 0}, 
  {months: 0, day: 0}, 
  {months: 3, day: 0.20}, 
  {months: 0, day: 0}, 
  {months: 0, day: 0}, 
  {months: 6, day: 0.26}, 
  {months: 0, day: 0}, 
  {months: 0, day: 0}, 
  {months: 9, day: 0.30}, 
  {months: 0, day: 0}, 
  {months: 0, day: 0}, 
  {months: 12, day: 0.33}
]

function Dashboard() {
  const { address } = useAccount()
  const [userData, setUserData] = useState(null)
  const [allAmounts, setAllAmounts] = useState(0)
  const [isReinvest, setIsReinvest] = useState(false)
  const [arrayAllAmounts, setArrayAllAmounts] = useState([])
  const {language} = useContext(LangContext)

  const { data, error, isPending } = useReadContracts({
    contracts: [{ 
      abi: staking,
      address: import.meta.env.VITE_CONTRACT,
      functionName: 'getUser',
      args: [address || null],
      chainId: net.id,
    }
    ]
  })
  const [getUser] = data || []

  const getAmounts = async () => {
    const user = getUser?.result
    if(user){
      let aa = 0;
      setUserData(await Promise.all(getUser?.result?.map(async (elem: any, i: any): Promise<any> => {
        const starttime = new Date(Number(elem.startTime) * 1000);
        const endtime = new Date((Number(elem.startTime) + (Number(elem.period) * 30 * import.meta.env.VITE_SECONDS_DELAY)) * 1000);
        const result = await readContract(config, {
          abi: staking,
          address: import.meta.env.VITE_CONTRACT,
          functionName: 'getUserAmount',
          args: [address || null, BigInt(i)],
          chainId: net.id,
        })
        const payPeriods = await readContract(config, {
          abi: staking,
          address: import.meta.env.VITE_CONTRACT,
          functionName: 'payPeriods',
          args: [BigInt(elem.period)],
          chainId: net.id,
        })
        if(Number(payPeriods) > Number(elem.withdrawnTime)){
          const day = (Number(payPeriods) - Number(elem.withdrawnTime)) / import.meta.env.VITE_SECONDS_DELAY
          if(day >= 1){
            //let sum = parseInt(day.toString()) * (parseFloat(formatEther(elem.investedAmount)) / 100 * percents[Number(elem.period)].day)
            aa += parseFloat(formatEther(result)) //sum
          }
        }
        if(elem.payPeriod == 0){
          setIsReinvest(true)
        }
        let std = starttime.getDate().toString()
        let stm = starttime.getMonth().toString()
        let etd = endtime.getDate().toString()
        let etm = endtime.getMonth().toString()

        if(starttime.getDate() < 10) std = '0' + std
        if(starttime.getMonth() < 10) stm = '0' + stm
        if(endtime.getDate() < 10) etd = '0' + etd
        if(endtime.getMonth() < 10) etm = '0' + etm

        return{
          number: i + 1,
          data: std + "." + stm + "." + starttime.getFullYear(),
          period: std + "." + stm + "." + starttime.getFullYear() + " - " + etd + "." + etm + "." + endtime.getFullYear(),
          sum: formatter.format(parseFloat(formatEther(elem.investedAmount))),
          percent: percents[Number(elem.period)].months,
          added: "+" + formatter.format(parseFloat(formatEther(result))),
          withdrawn: formatter.format(parseFloat(formatEther(elem.withdrawnAmount)))
        }
      })));
      setAllAmounts(aa)
    }
  }

  const withdrawAll = async () => {
    const payer = await readContract(config, {
      abi: staking,
      address: import.meta.env.VITE_CONTRACT,
      functionName: 'payer'
    })
    const balanceOf = await readContract(config, {
      abi: usdt,
      address: import.meta.env.VITE_CONTRACT_USDT,
      functionName: 'balanceOf',
      args: [payer],
    })
    if(Number(formatEther(balanceOf)) > 0){
      const allowance = await readContract(config, {
        abi: usdt,
        address: import.meta.env.VITE_CONTRACT_USDT,
        functionName: 'allowance',
        args: [payer, import.meta.env.VITE_CONTRACT]
      })
      console.log(Number(formatEther(allowance)))
      if(Number(formatEther(allowance)) > 0){
        const withdraw = await writeContract(config, {
          abi: staking,
          address: import.meta.env.VITE_CONTRACT,
          functionName: 'withdrawAll'
        })
  
        const transactionReceipt = await waitForTransactionReceipt(config, {
          chainId: net.id, 
          hash: withdraw,
        })
  
        if(transactionReceipt.status == "success"){
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
        }else{
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
  }

  const reinvestAll = async () => {
    const reinvestPool = await writeContract(config, {
      abi: staking,
      address: import.meta.env.VITE_CONTRACT,
      functionName: 'reinvestPool',
      args: [3]
    })

    const transactionReceipt = await waitForTransactionReceipt(config, {
      chainId: net.id, 
      hash: reinvestPool,
    })

    if(transactionReceipt.status == "success"){
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
    }else{
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
  }

  useEffect(() => {
    if(address){
      getAmounts()
    }
  }, [getUser])


const tableHeader = [
  "№",
  language.stacking.date,
  language.stacking.stackingPeriod,
  language.stacking.sum,
  "%",
  language.stacking.accrued,
  language.stacking.received,
];

  return (
    <>
      <div className="element-background flex flex-col gap-[15px]">
        <div className="flex flex-row items-center justify-between max-[787px]:items-start max-[576px]:flex-col">
          <div>
            <div className="text-[14px] text-[#8296A4]">
              {language.stacking.availableForReceipt}
            </div>
            <div className="text-[20px] text-[#fff] font-[700]">{formatter.format(allAmounts)} USDT</div>
          </div>
          <div className="flex flex-row items-center gap-[15px] max-[787px]:flex-col ">
            <Button type="button" view="primary" disabled={allAmounts == 0} onClick={withdrawAll}>
              {language.stacking.withdrawProfit}
            </Button>
            <Button type="button" view="secondary" disabled={!isReinvest} onClick={reinvestAll}>
              {language.stacking.reinvest}
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          {(address && userData) &&
            <Table
              header={tableHeader}
              rows={userData}
              rowItem={(row: Row, i: number) => (
                <tr key={row.number}>
                  <RowItem
                    item={row.number}
                    optionalStyle={`${
                      i % 2 === 0 ? "" : "bg-[#262D39] rounded-l-md"
                    }`}
                  />
                  <RowItem
                    item={row.data}
                    optionalStyle={`${i % 2 === 0 ? "" : "bg-[#262D39]"}`}
                  />
                  <RowItem
                    item={row.period}
                    optionalStyle={`${i % 2 === 0 ? "" : "bg-[#262D39]"}`}
                  />
                  <RowItem
                    item={row.sum}
                    optionalStyle={`${i % 2 === 0 ? "" : "bg-[#262D39]"}`}
                  />
                  <RowItem
                    item={row.percent}
                    optionalStyle={`${i % 2 === 0 ? "" : "bg-[#262D39]"}`}
                  />
                  <RowItem
                    item={row.added}
                    optionalStyle={`${i % 2 === 0 ? "" : "bg-[#262D39]"}`}
                  />
                  <RowItem
                    item={row.withdrawn}
                    optionalStyle={`${
                      i % 2 === 0 ? "" : "bg-[#262D39] rounded-r-md"
                    }`}
                  />
                </tr>
              )}
            />
          }
        </div>
      </div>
    </>
  );
}

export default Dashboard;
