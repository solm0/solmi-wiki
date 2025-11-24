import { pretendard } from "../lib/localfont"
import Giscus from "./giscus"
import Copyright from "./copyright"

export default function Footer() {
  return (
    <footer className={`${pretendard.className} text-text-800 text-sm flex flex-col gap-24 mb-48`}>
      <Giscus />
      <Copyright />
    </footer>
  )
}