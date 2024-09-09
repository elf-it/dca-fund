import { useContext } from "react";
import { LangContext } from "@/app/context/LangaugeContext";

function Footer() {
  const {language} = useContext(LangContext)

  const footerLinks = [
    {
      link: "#",
      title: language.stacking.aboutProject,
    },
    {
      link: "#",
      title: language.stacking.registrationData,
    },
    {
      link: "#",
      title: language.stacking.instruction,
    },
    {
      link: "#",
      title: language.stacking.warningAboutPossibleRisks,
    },
    {
      link: "#",
      title: language.stacking.termsOfUseOfTheService,
    },
  ];

  return (
    <div className="element-background flex flex-row flex-wrap justify-between gap-[15px] items-center mt-[20px] rounded-b-[0px] ">
      {footerLinks.map((link, i) => (
        <a key={i} href={link.link} className="text-[#8296A4] text-[14px] ">
          {link.title}
        </a>
      ))}
    </div>
  );
}

export default Footer;
