import Select from "@shared/ui/components/Select";
import {useLanguage} from "../model/useLanguage";
import { useCookies } from "react-cookie";

function LanguageSelect() {
  const {langsNames , changeLanguahe} = useLanguage(); // получаем данные, но пока фэйковые будут
  const [ cookie ] = useCookies();

  let defaultIndex = langsNames.findIndex((lang) => {
    return lang.title === cookie.language
  })

  if(defaultIndex < 0) defaultIndex = 0

  return (
    <div className="w-[88px]">
      <Select
        listItems={langsNames}
        defaultIndex={defaultIndex}
        cb={(item: string, i: number) => changeLanguahe(item)}
      />
    </div>
  );
}

export default LanguageSelect;
