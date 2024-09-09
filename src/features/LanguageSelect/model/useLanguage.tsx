import { useContext } from "react"
import { LangContext } from "@/app/context/LangaugeContext"

export const useLanguage = () => {
    const { langList, language, changeLanguahe} = useContext<any>(LangContext)

    const langsNames = []

    for ( let lang in langList ){
      langsNames.push({
        title:lang,
        value:lang
      })
    }

    return {language , langsNames, changeLanguahe}
}