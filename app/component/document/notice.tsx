import { NoticeNode, Intent } from "../../lib/type";
import Paragraph from "./paragraph";
import { Info, TriangleAlert, Bug, CircleCheckBig } from "lucide-react";

const style: Record<Intent, { icon: React.ReactNode; bg: string; text: string; border: string }> = {
  info: { icon: <Info className="shrink-0 w-5 h-8"></Info>, bg: 'rgb(42 105 255 / 10%)', text: 'rgb(75 95 255)', border: 'rgb(75 95 255 / 30%)' },
  warning: { icon: <TriangleAlert className="shrink-0 w-5 h-8"></TriangleAlert>, bg: 'rgb(225 255 82 / 10%)', text: 'rgb(176 210 17)', border: 'rgb(176 210 17 / 30%)'},
  error: { icon: <Bug className="shrink-0 w-5 h-8"></Bug>, bg: 'rgb(255 51 51 / 10%)', text: 'rgb(220 75 75)', border: 'rgb(220 75 75 / 30%)' },
  success: { icon: <CircleCheckBig className="shrink-0 w-5 h-8"></CircleCheckBig>, bg: 'rgb(0 221 141 / 10%)', text: 'rgb(0 181 115)', border: 'rgb(0 181 115 / 30%)' },
}

export default function Notice({
  notice,
}: {
  notice: NoticeNode;
}) {
  const intent = notice.props.intent;
  const config = style[intent];

  return (
    <div
      className={`rounded-sm p-4 flex items-start gap-4 text ${config.text} text-text-950 my-1`}
      style={{
        background: config.bg,
        border: `1px solid ${config.border}`,
      }}
    >
      <div style={{color: config.text,}}>
        {config.icon}
      </div>
      <div className="text-[0.95em] flex flex-col gap-3">
        {notice.children?.[0].children.map((ch, idx) => (
          <Paragraph key={idx} p={ch} />
        ))}
      </div>
    </div>
  )
}