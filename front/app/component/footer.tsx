import { pretendard } from "../lib/localfont"
import Giscus from "./giscus"
import Copyright from "./copyright"

export default function Footer({giscus=true}:{giscus?:boolean}) {
  return (
    <footer
      className={`${pretendard.className} text-text-800 text-sm flex flex-col pb-48 pr-4 lg:pr-0 ${giscus ? "gap-24" : "pt-24"}`}
    >
      {giscus && <Giscus />}
      <Copyright />
    </footer>
  )
}
