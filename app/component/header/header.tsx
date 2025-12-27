import { Funnel } from "lucide-react";
import EnableButton from "../atoms/enable-button";
import Menus from "./Menus";
import { ToolBoxIcons } from "./ToolBoxIcons";

export default function Header() {
  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 w-screen h-10 px-3 md:px-4 border-b border-text-600 bg-background flex items-center justify-center z-60 transition-all duration-300">
      
      {/* note inspector 아이콘 */}
      <div className="justify-self-start">
        <EnableButton
          value={{
            value: 'noteInspector',
            name: <Funnel className="w-4 h-4" />,
            title: '노트 탐색기'
          }} 
        />
      </div>

      {/* 메뉴 */}
      <Menus />

      {/* tool box 아이콘 */}
      <div className="ml-auto">
        <ToolBoxIcons />
      </div>

    </header>
  );
}