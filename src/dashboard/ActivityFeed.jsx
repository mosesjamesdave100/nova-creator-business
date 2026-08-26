import { IconChip } from "./IconChip";
import { activity } from "../data/mockData";

const ICON_TONE = {
  bag: "accent",
  users: "violet",
  download: "cyan",
  youtube: "accent",
  payout: "muted",
};

export function ActivityFeed() {
  return (
    <div className="rounded-xl border border-hairline bg-surface p-5 md:p-7">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">Recent Activity</h3>
        <a href="#" className="text-xs font-semibold text-muted hover:text-text">
          View all
        </a>
      </div>
      <div className="mt-5 flex flex-col">
        {activity.map((item, i) => (
          <div
            key={item.id}
            className={`flex items-start gap-3.5 py-3.5 ${i !== activity.length - 1 ? "border-b border-hairline" : ""}`}
          >
            <IconChip icon={item.icon} tone={ICON_TONE[item.icon] ?? "muted"} />
            <div className="min-w-0 flex-1">
              <div className="text-sm text-text">{item.title}</div>
              <div className="mt-0.5 text-[13px] text-muted">{item.detail}</div>
            </div>
            <div className="shrink-0 whitespace-nowrap text-xs text-faint">{item.timestamp}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
