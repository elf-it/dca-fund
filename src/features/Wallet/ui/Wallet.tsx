import MetaMaskImage from "@shared/ui/images/metamask.png";
import Icon from "@shared/ui/components/Icon";
import Button from "@shared/ui/components/Button";
import { useAccount, useDisconnect, useConnect, useChainId } from 'wagmi'
import { useContext, useEffect } from "react";
import { LangContext } from "@/app/context/LangaugeContext";
import { Bounce, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function Wallet() {
  const { address } = useAccount()
  const { connectors, connect } = useConnect()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()

  const {language} = useContext(LangContext)

  const getAML = async () => {
    if(address){
      try {
        const request = await fetch('https://apist.srws.ru/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Accept": "*/*"
            },
            body: JSON.stringify({
                address
            })
        })
        const result = await request.json()
        const data = result.data.risk_level
        if(data == "Medium" || data == "High"){
          disconnect()

          toast.error(language.stacking.yourWalletHasNotPassed, {
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
      } catch (error) {
          console.log("Error during AML: ", error)
          return null
      }
    }
  }

  useEffect(() => {
    if(address){
      getAML()
    }
  }, [address])

  return (
    <div className="element-background flex flex-col gap-[15px] items-center">
      <div className="bg-gradient-to-tr from-[#FFFFFF]/0 to-[#FDDF96] p-[1px] w-[94px] h-[94px] rounded-full relative">
        <div className="bg-[#272B34] h-full w-full rounded-full flex flex-row items-center justify-center">
          <img src={MetaMaskImage} alt="" />
        </div>
        {address ?
          <div className="w-[24px] h-[24px] bg-[#73D053] rounded-full flex flex-row items-center justify-center absolute bottom-0 right-0">
            <Icon width={22} color="transparent" name="done" />
          </div>
          : <div className="w-[24px] h-[24px] bg-[#FF5F5F] rounded-full flex flex-row items-center justify-center absolute bottom-0 right-0">
          <Icon width={10} color="#fff" name="small-cross" />
        </div>
        }
      </div>
      <p className="text-[20px] text-[#fff] font-[700]">
        {/* {address ? lang.stacking.ru.connectedWallet : lang.stacking.ru.notConnectedWallet} */}
      </p>
      {address &&
      <>
        <div className="flex flex-row items-center gap-[10px]">
          <p className="text-[16px] text-[#fff]/30">
          BSC {chainId == 56 ? "mainnet": "testnet"}
          </p>
        </div>
        <div className="flex flex-row items-center gap-[10px]">
          <Icon width={18} color="rgba(255,255,255,0.3)" name="wallet" />
          <p className="text-[16px] text-[#fff]/30">
            {address?.substring(0, 5)}....{address?.substring(address?.length - 5)}
          </p>
        </div>
      </>
      }
      <div className="w-full flex flex-col">
        {address ?
          (
            <Button type="button" view="primary" key={123} onClick={() => disconnect()}>
              {language.stacking.disconnect}
            </Button>
          )
        :
          connectors.map((connector) => (
            <>
            {connector.name != "Injected" &&
            <Button type="button" view="primary" key={connector.name} onClick={() => {connect({ connector })}}>
              {connector.name}
            </Button>
            }
            </>
          ))
        }
      </div>
    </div>
  );
}

export default Wallet;