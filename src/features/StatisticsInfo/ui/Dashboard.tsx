import lang from "@/../lang.json";
import { Table, RowItem } from "@shared/ui/components/Table";
import { Row } from "@shared/ui/components/Table";
import Button from "@shared/ui/components/Button";

import { type BaseError, useAccount, useReadContracts } from 'wagmi'
import { staking } from '@/abi/abi'
import { bscTestnet } from 'wagmi/chains'
import { readContract } from 'wagmi/actions'
import { config } from '@/config'
import { formatEther } from 'viem'
import { useEffect, useState } from "react";

const formatter = new Intl.NumberFormat('en', {
  //style: 'currency',
  //currency: 'USDT'
});

const tableHeader = [
  "№",
  "Дата",
  "Период стерирования",
  "Сумма",
  "%",
  "Начислено",
  "Получено",
];

const percents = [
  {months: 0, day: 0}, 
  {months: 0, day: 0}, 
  {months: 0, day: 0}, 
  {months: 6, day: 0.20}, 
  {months: 0, day: 0}, 
  {months: 0, day: 0}, 
  {months: 8, day: 0.26}, 
  {months: 0, day: 0}, 
  {months: 0, day: 0}, 
  {months: 9, day: 0.30}, 
  {months: 0, day: 0}, 
  {months: 0, day: 0}, 
  {months: 10, day: 0.33}
]

function Dashboard() {
  const { address } = useAccount()
  const [userData, setUserData] = useState(null)
  const [allAmounts, setAllAmounts] = useState(0)
  const [arrayAllAmounts, setArrayAllAmounts] = useState([])

  const { data, error, isPending } = useReadContracts({
    contracts: [{ 
      abi: staking,
      address: '0xad0B755F4a89966a0954bE6B1Bea59D800c6D09C',
      functionName: 'getUser',
      args: [address || null],
      chainId: bscTestnet.id,
    }
    ]
  })
  const [getUser] = data || []

  const getAmounts = async () => {
    const user = getUser?.result
    if(user){
      await Promise.all(user.map(async (event: any, i: number): Promise<any> => {
        const result = await readContract(config, {
          abi: staking,
          address: '0xad0B755F4a89966a0954bE6B1Bea59D800c6D09C',
          functionName: 'getUserAmount',
          args: [address || null, BigInt(i)],
          chainId: bscTestnet.id,
        })
        setAllAmounts(allAmounts + parseFloat(formatEther(result)))
        let arr: any = [...arrayAllAmounts, parseFloat(formatEther(result))]
        console.log(arr)
        setArrayAllAmounts(arr)
      }))
      setUserData(getUser?.result?.map((elem: any, i: any) => {
        const starttime = new Date(Number(elem.startTime) * 1000);
        const endtime = new Date((Number(elem.startTime) + (Number(elem.period) * 30 * 86400)) * 1000);
        const addedc:any = added(elem)
        return{
          number: i + 1,
          data: starttime.getDate() + "." + starttime.getMonth() + "." + starttime.getFullYear(),
          period: starttime.getDate() + "." + starttime.getMonth() + "." + starttime.getFullYear() + " - " + endtime.getDate() + "." + endtime.getMonth() + "." + endtime.getFullYear(),
          sum: formatter.format(parseFloat(formatEther(elem.investedAmount))),
          percent: percents[Number(elem.period)].months,
          added: "+" + formatter.format(parseFloat(formatEther(arrayAllAmounts[i]))),
          withdrawn: formatter.format(parseFloat(formatEther(elem.withdrawnAmount)))
        }
      }));
    }
  }

  const added = (elem: any) => {
    const per = 86400;
    if(Number(elem.withdrawnTime) <= Number(elem.startTime)){
      return "0"
    }else{
      return formatter.format(((Number(elem.withdrawnTime) - Number(elem.startTime)) / per) * percents[Number(elem.period)].day)
    }
  }

  useEffect(() => {
    if(address){
      getAmounts()
    }
  }, [getUser])

  return (
    <>
      <div className="element-background flex flex-col gap-[15px]">
        <div className="flex flex-row items-center justify-between max-[787px]:items-start max-[576px]:flex-col">
          <div>
            <div className="text-[14px] text-[#8296A4]">
              {lang.stacking.ru.availableForReceipt}
            </div>
            <div className="text-[20px] text-[#fff] font-[700]">{formatter.format(allAmounts)}</div>
          </div>
          <div className="flex flex-row items-center gap-[15px] max-[787px]:flex-col ">
            <Button type="button" view="primary">
              Вывести прибыль
            </Button>
            <Button type="button" view="secondary">
              Реинвестировать
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
