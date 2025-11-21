import ExpandButton from "../atoms/expand-button";
import { Settings } from "lucide-react";
import { Funnel } from "lucide-react";
import EnableButton from "../atoms/enable-button";
import ThemeButton from "../atoms/theme-button";
import Menus from "./Menus";

const filterCmp = {
  value: 'note-inspector',
  name: <Funnel className="w-4 h-4" />
}

export default function Header() {
  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 w-screen h-10 px-4 border-b border-text-600 bg-background flex items-center justify-center z-70 transition-all duration-300">
      <div className="mr-auto">
        <EnableButton value={filterCmp} />
      </div>
      <Menus />
    </header>
  );
}