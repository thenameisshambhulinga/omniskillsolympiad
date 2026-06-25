import type { OmniColorTone } from "@/data/omni-theme";
import { getOmniToneStyle } from "@/data/omni-theme";

type OsoColorRailItem = {
  label: string;
  value?: string;
  tone: OmniColorTone;
};

type OsoColorRailProps = {
  items: OsoColorRailItem[];
};

export default function OsoColorRail({ items }: OsoColorRailProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const style = getOmniToneStyle(item.tone);

        return (
          <div
            key={`${item.label}-${item.tone}`}
            className={`inline-flex items-center gap-2 rounded-full border ${style.border} ${style.softBg} px-3 py-2 text-xs font-black uppercase tracking-[0.1em] ${style.text}`}
          >
            <span
              className={`h-2.5 w-2.5 rounded-full bg-gradient-to-r ${style.gradient}`}
            />
            {item.label}
            {item.value ? (
              <span className="normal-case tracking-normal opacity-70">
                {item.value}
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}