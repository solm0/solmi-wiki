import { Search } from "lucide-react";
import EnableButton from "../atoms/enable-button";
import Menus from "./Menus";
import { ToolBoxIcons } from "./ToolBoxIcons";

export default function Header() {
  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 w-screen h-10 px-3 md:px-3 flex items-center justify-center z-60 transition-all duration-300 pt-3">
      <div className="w-full h-20 absolute top-0 left-0 bg-linear-to-b from-background via-background/80 to-transparent">

      </div>
      {/* note inspector 아이콘 */}
      <div className="justify-self-start z-10">
        <EnableButton
          value={{
            value: 'noteInspector',
            name: <Search className="w-4 h-4 md:w-3.5 md:h-3.5" />,
            title: '노트 탐색기'
          }} 
        />
      </div>

      {/* 메뉴 */}
      <Menus />

      {/* tool box 아이콘 */}
      <div className="ml-auto pt-1">
        <ToolBoxIcons />
      </div>

    </header>
  );
}