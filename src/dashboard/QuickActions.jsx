import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import { quickActions } from "../data/mockData";

const ACTION_ICON = {
  "add-product": "products",
  "create-drop": "bag",
  "new-post": "content",
  "go-live": "play",
  "view-analytics": "analytics",
};

export function QuickActions() {
  const [toast, setToast] = useState(null);
  const timeoutRef = useRef(null);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  function handleClick(action) {
    setToast(action.label);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setToast(null), 2200);
  }

  return (
    <div className="rounded-xl border border-hairline bg-surface p-5 md:p-7">
      <h3 className="font-display text-lg font-semibold">Quick Actions</h3>
      <div className="mt-5 flex flex-wrap gap-2.5">
        {quickActions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={() => handleClick(action)}
            className="flex items-center gap-2 rounded-md border border-hairline bg-bg px-3.5 py-2.5 text-sm text-text transition-colors hover:border-[#333] hover:bg-surface-2"
          >
            <Icon name={ACTION_ICON[action.id]} size={15} className="text-muted" />
            {action.label}
          </button>
        ))}
      </div>
      <div
        className={`mt-4 text-[13px] text-good transition-opacity duration-200 ${
          toast ? "opacity-100" : "opacity-0"
        }`}
        role="status"
        aria-live="polite"
      >
        {toast ? `${toast} opened.` : " "}
      </div>
    </div>
  );
}
