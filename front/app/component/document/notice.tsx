import { NoticeNode, Intent } from "../../lib/type";
import Paragraph from "./paragraph";
import { Info, TriangleAlert, Bug, CircleCheckBig } from "lucide-react";

const style: Record<Intent, { icon: React.ReactNode; bg: string; text: string; }> = {
  info: { icon: <Info className="shrink-0 w-4 h-8"></Info>, bg: 'rgb(42 105 255 / var(--notice-alpha))', text: 'rgb(75 95 255)' },
  warning: { icon: <TriangleAlert className="shrink-0 w-4 h-8"></TriangleAlert>, bg: 'rgb(225 255 82 / var(--notice-alpha))', text: 'rgb(176 210 17)'},
  error: { icon: <Bug className="shrink-0 w-4 h-8"></Bug>, bg: 'rgb(255 51 51 / var(--notice-alpha))', text: 'rgb(220 75 75)'},
  success: { icon: <CircleCheckBig className="shrink-0 w-4 h-8"></CircleCheckBig>, bg: 'rgb(0 221 141 / var(--notice-alpha))', text: 'rgb(0 181 115)' },
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
      className={`rounded-sm px-3 py-2  flex items-start gap-3 text ${config.text} text-text-950 my-1`}
      style={{
        background: config.bg,

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
