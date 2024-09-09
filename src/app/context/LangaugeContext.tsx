import React, { createContext, useState } from "react";
import langList from "@/../lang.json";
import { useCookies } from "react-cookie";

interface ILanguageContext {
  children: React.ReactNode;
}

export const LangContext = createContext<any>(null);

export default function LangaugeContext({ children }: ILanguageContext) {
  

  const [cookie, setCookie] = useCookies();

  if(!cookie.language){
    setCookie("language" , "EN")
  }

  const [language, setLanguage] = useState(langList[cookie.language]);

  const changeLanguahe = (key: string) => {
    setLanguage(langList[key]);
    setCookie("language", key);
  };

  return (
    <LangContext.Provider value={{  language, langList, changeLanguahe }}>
      {children}
    </LangContext.Provider>
  );
}
