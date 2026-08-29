import { Link } from "react-router-dom";
import { Icon } from "./Icon";
import { quickActions } from "../data/quickActions";

export function QuickActions() {
  return (
    <div className="rounded-xl border border-hairline bg-surface p-5 md:p-7">
      <h3 className="font-display text-lg font-semibold">Quick Actions</h3>
      <div className="mt-5 flex flex-wrap gap-2.5">
        {quickActions.map((action) => (
          <Link
            key={action.id}
            to={action.to}
            state={action.state}
            className="flex items-center gap-2 rounded-md border border-hairline bg-bg px-3.5 py-2.5 text-sm text-text transition-colors hover:border-[#333] hover:bg-surface-2"
          >
            <Icon name={action.icon} size={15} className="text-muted" />
            {action.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
