import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { Avatar } from "./Avatar";
import { StatusBadge } from "./StatusBadge";
import {
  profileSettings,
  notificationPreferences,
  privacySettings,
  securityInfo,
  billingInfo,
  appearanceSettings,
  teamMembers as INITIAL_TEAM,
  TEAM_ROLES,
} from "../data/settings";
import { connectedAccounts as INITIAL_ACCOUNTS } from "../data/connectedAccounts";
import { PLATFORMS } from "../data/platforms";
import { CREATOR_CATEGORIES, TIMEZONES, CURRENCIES } from "../data/onboarding";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../services/profileService";
import { listConnectedAccounts } from "../services/connectedAccountsService";

const CATEGORIES = [
  { id: "general", label: "General", icon: "settings" },
  { id: "profile", label: "Profile", icon: "users" },
  { id: "notifications", label: "Notifications", icon: "bell" },
  { id: "connected", label: "Connected Accounts", icon: "integrations" },
  { id: "team", label: "Team", icon: "memberships" },
  { id: "privacy", label: "Privacy", icon: "alert" },
  { id: "security", label: "Security", icon: "check" },
  { id: "billing", label: "Billing", icon: "payout" },
  { id: "appearance", label: "Appearance", icon: "sparkle" },
];

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "rounded-md border border-hairline bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none";

function Toggle({ checked, onChange, label, description }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 py-3.5 text-left"
    >
      <div className="min-w-0">
        <div className="text-sm text-text">{label}</div>
        {description && <div className="mt-0.5 text-xs text-muted">{description}</div>}
      </div>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-accent" : "bg-surface-2"}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${checked ? "translate-x-[22px]" : "translate-x-0.5"}`}
        />
      </span>
    </button>
  );
}

function SaveBanner({ message }) {
  if (!message) return null;
  return (
    <div className="mb-5 flex items-center gap-2 rounded-md border border-accent/25 bg-accent/[0.06] px-3.5 py-2.5 text-[13px] text-accent">
      <Icon name="check" size={14} />
      {message}
    </div>
  );
}

function useSavedMessage() {
  const [message, setMessage] = useState(null);
  function flash(text) {
    setMessage(text);
    setTimeout(() => setMessage(null), 2800);
  }
  return [message, flash];
}

function GeneralSection() {
  const { user, profile, refreshProfile } = useAuth();
  const [form, setForm] = useState({
    displayName: profile?.display_name ?? "",
    username: profile?.username ?? "",
    category: profile?.category ?? CREATOR_CATEGORIES[0],
    timezone: profile?.timezone ?? TIMEZONES[0],
    currency: profile?.currency ?? CURRENCIES[0],
  });
  const [saved, flash] = useSavedMessage();
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [connectedCount, setConnectedCount] = useState(null);

  useEffect(() => {
    let active = true;
    if (user) {
      listConnectedAccounts(user.id).then(({ accounts }) => {
        if (active) setConnectedCount(accounts.filter((a) => a.status === "connected").length);
      });
    }
    return () => {
      active = false;
    };
  }, [user]);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    const { error: saveError } = await updateProfile(user.id, {
      display_name: form.displayName.trim(),
      username: form.username.trim() || null,
      category: form.category,
      timezone: form.timezone,
      currency: form.currency,
    });
    setSaving(false);
    if (saveError) {
      setError(saveError);
      return;
    }
    await refreshProfile();
    flash("Changes saved.");
  }

  return (
    <div>
      <h2 className="font-display text-lg font-semibold">General</h2>
      <p className="mt-1 text-sm text-muted">Your account's basic details.</p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-hairline bg-bg p-3.5">
          <div className="text-[11px] font-semibold tracking-[0.08em] text-muted">ACCOUNT EMAIL</div>
          <div className="mt-1 truncate text-sm text-text">{user?.email}</div>
        </div>
        <div className="rounded-lg border border-hairline bg-bg p-3.5">
          <div className="text-[11px] font-semibold tracking-[0.08em] text-muted">ONBOARDING</div>
          <div className="mt-1 text-sm text-text">{profile?.onboarding_completed ? "Complete" : "Incomplete"}</div>
        </div>
        <div className="rounded-lg border border-hairline bg-bg p-3.5">
          <div className="text-[11px] font-semibold tracking-[0.08em] text-muted">CONNECTED PLATFORMS</div>
          <div className="mt-1 text-sm text-text">{connectedCount === null ? "…" : `${connectedCount} of 7`}</div>
        </div>
      </div>

      <SaveBanner message={saved} />
      {error && (
        <div className="mb-5 rounded-md border border-danger/25 bg-danger/[0.06] px-3.5 py-2.5 text-[13px] text-danger">
          {error}
        </div>
      )}
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Creator display name">
          <input className={inputClass} value={form.displayName} onChange={(e) => update("displayName", e.target.value)} />
        </Field>
        <Field label="Username">
          <input className={inputClass} value={form.username} onChange={(e) => update("username", e.target.value)} />
        </Field>
        <Field label="Email">
          <input type="email" disabled value={user?.email ?? ""} className={`${inputClass} cursor-not-allowed opacity-60`} />
        </Field>
        <Field label="Creator category">
          <select className={inputClass} value={form.category} onChange={(e) => update("category", e.target.value)}>
            {CREATOR_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Timezone">
          <select className={inputClass} value={form.timezone} onChange={(e) => update("timezone", e.target.value)}>
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Default currency">
          <select className={inputClass} value={form.currency} onChange={(e) => update("currency", e.target.value)}>
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="mt-6 rounded bg-accent px-5 py-2.5 text-[13px] font-semibold text-bg transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? "SAVING…" : "SAVE CHANGES"}
      </button>
    </div>
  );
}

function ProfileSection() {
  const { user, profile, refreshProfile } = useAuth();
  const [form, setForm] = useState({
    displayName: profile?.display_name ?? "",
    bio: profile?.bio ?? "",
    website: profile?.website ?? "",
  });
  const [saved, flash] = useSavedMessage();
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    const { error: saveError } = await updateProfile(user.id, {
      display_name: form.displayName.trim(),
      bio: form.bio.trim(),
      website: form.website.trim(),
    });
    setSaving(false);
    if (saveError) {
      setError(saveError);
      return;
    }
    await refreshProfile();
    flash("Profile saved.");
  }

  return (
    <div>
      <h2 className="font-display text-lg font-semibold">Profile</h2>
      <p className="mt-1 text-sm text-muted">How you appear on your public creator profile and media kit.</p>
      <SaveBanner message={saved} />
      {error && (
        <div className="mb-5 rounded-md border border-danger/25 bg-danger/[0.06] px-3.5 py-2.5 text-[13px] text-danger">
          {error}
        </div>
      )}

      <div className="mt-5 flex items-center gap-4">
        <Avatar size={64} />
        <div>
          <button type="button" className="rounded border border-hairline px-3.5 py-2 text-[13px] font-semibold text-text hover:border-[#333]">
            Upload image
          </button>
          <div className="mt-1.5 text-xs text-faint">Placeholder avatar for this prototype.</div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4">
        <Field label="Display name">
          <input className={inputClass} value={form.displayName} onChange={(e) => update("displayName", e.target.value)} />
        </Field>
        <Field label="Bio">
          <textarea
            rows={3}
            className={`${inputClass} resize-none`}
            value={form.bio}
            onChange={(e) => update("bio", e.target.value)}
          />
        </Field>
        <Field label="Website">
          <input className={inputClass} value={form.website} onChange={(e) => update("website", e.target.value)} />
        </Field>
        <div>
          <div className="text-[13px] font-medium text-muted">Social links</div>
          <div className="mt-2 flex flex-col divide-y divide-hairline rounded-md border border-hairline">
            {profileSettings.socialLinks.map((link) => (
              <div key={link.platformId} className="flex items-center gap-3 px-3.5 py-2.5">
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-semibold"
                  style={{ background: `${PLATFORMS[link.platformId].brandColor}22`, color: PLATFORMS[link.platformId].brandColor }}
                >
                  {PLATFORMS[link.platformId].name.charAt(0)}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm text-text">{link.url}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="mt-6 rounded bg-accent px-5 py-2.5 text-[13px] font-semibold text-bg transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? "SAVING…" : "SAVE PROFILE"}
      </button>
    </div>
  );
}

const NOTIFICATION_TOGGLES = [
  { key: "sponsorshipAlerts", label: "Sponsorship alerts", description: "New offers and deal updates." },
  { key: "contentPerformanceAlerts", label: "Content performance alerts", description: "When a video or Short over/under-performs." },
  { key: "audienceInsights", label: "Audience insights", description: "Notable shifts in your audience activity." },
  { key: "revenueAlerts", label: "Revenue alerts", description: "Payouts and revenue milestones." },
  { key: "communityActivity", label: "Community activity", description: "New posts, polls and member milestones." },
  { key: "storeAlerts", label: "Product/store alerts", description: "New orders and inventory changes." },
];

function NotificationsSection() {
  const [prefs, setPrefs] = useState(notificationPreferences);

  function toggle(key) {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div>
      <h2 className="font-display text-lg font-semibold">Notifications</h2>
      <p className="mt-1 text-sm text-muted">Choose what NOVA should notify you about.</p>

      <div className="mt-5 flex flex-col divide-y divide-hairline rounded-lg border border-hairline px-4">
        {NOTIFICATION_TOGGLES.map((item) => (
          <Toggle key={item.key} checked={prefs[item.key]} onChange={() => toggle(item.key)} label={item.label} description={item.description} />
        ))}
      </div>

      <div className="mt-5 flex flex-col divide-y divide-hairline rounded-lg border border-hairline px-4">
        <Toggle
          checked={prefs.emailNotifications}
          onChange={() => toggle("emailNotifications")}
          label="Email notifications"
          description="Send the alerts above to your email."
        />
        <Toggle
          checked={prefs.pushNotifications}
          onChange={() => toggle("pushNotifications")}
          label="Push notifications"
          description="Send the alerts above as push notifications."
        />
      </div>
    </div>
  );
}

function ConnectModal({ platformName, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-sm rounded-xl border border-hairline bg-surface-2 p-6 text-center shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)]">
        <Icon name="alert" size={22} className="mx-auto text-accent" />
        <h3 className="mt-3 font-display text-base font-semibold">Connect {platformName}</h3>
        <p className="mt-2 text-[13px] leading-relaxed text-muted">
          Account connection will be available when NOVA's platform integrations are enabled.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded bg-accent py-2.5 text-[13px] font-semibold text-bg transition-transform hover:scale-[1.02]"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

function ConnectedAccountsSection() {
  const accounts = INITIAL_ACCOUNTS;
  const [modalPlatform, setModalPlatform] = useState(null);

  return (
    <div>
      <h2 className="font-display text-lg font-semibold">Connected Accounts</h2>
      <p className="mt-1 text-sm text-muted">
        These mirror the connections on the Integrations page. Real OAuth isn't wired up in this prototype.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {accounts.map((account) => (
          <div key={account.id} className="rounded-xl border border-hairline bg-bg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-md text-sm font-semibold"
                  style={{ background: `${account.brandColor}22`, color: account.brandColor }}
                >
                  {account.name.charAt(0)}
                </span>
                <div>
                  <div className="text-sm font-semibold text-text">{account.name}</div>
                  <div className="text-xs text-muted">{account.accountLabel ?? "Not connected"}</div>
                </div>
              </div>
              <StatusBadge label={account.connected ? "Connected" : "Not connected"} tone={account.connected ? "good" : "muted"} />
            </div>
            <button
              type="button"
              onClick={() => setModalPlatform(account.name)}
              className={`mt-4 w-full rounded border py-2 text-[13px] font-semibold transition-colors ${
                account.connected ? "border-[#333] text-text hover:border-muted" : "border-transparent bg-accent text-bg hover:scale-[1.02]"
              }`}
            >
              {account.connected ? "Manage" : "Connect"}
            </button>
          </div>
        ))}
      </div>

      {modalPlatform && <ConnectModal platformName={modalPlatform} onClose={() => setModalPlatform(null)} />}
    </div>
  );
}

const TEAM_STATUS_TONE = { Active: "good", Invited: "warning" };

function InviteMemberForm({ onCancel, onInvite }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(TEAM_ROLES[0]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    onInvite({ email: email.trim(), role });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 rounded-lg border border-hairline p-4 sm:flex-row sm:items-center">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email address"
        aria-label="Invite email address"
        autoFocus
        className={`${inputClass} sm:flex-1`}
      />
      <select value={role} onChange={(e) => setRole(e.target.value)} aria-label="Role" className={inputClass}>
        {TEAM_ROLES.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
      <div className="flex gap-2">
        <button type="submit" className="rounded bg-accent px-4 py-2.5 text-[13px] font-semibold text-bg transition-transform hover:scale-[1.02]">
          Send invite
        </button>
        <button type="button" onClick={onCancel} className="rounded border border-hairline px-4 py-2.5 text-[13px] font-semibold text-text hover:border-[#333]">
          Cancel
        </button>
      </div>
    </form>
  );
}

function TeamSection() {
  const [members, setMembers] = useState(INITIAL_TEAM);
  const [showInvite, setShowInvite] = useState(false);
  const [saved, flash] = useSavedMessage();

  function handleInvite({ email, role }) {
    setMembers((prev) => [...prev, { id: `team-${Date.now()}`, name: email, email, role, status: "Invited" }]);
    setShowInvite(false);
    flash(`Invite sent to ${email}.`);
  }

  function handleRemove(id) {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    flash("Team member removed.");
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-semibold">Team</h2>
          <p className="mt-1 text-sm text-muted">Manage who has access to your NOVA workspace.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowInvite((v) => !v)}
          className="flex shrink-0 items-center gap-1.5 rounded bg-accent px-4 py-2.5 text-[13px] font-semibold text-bg transition-transform hover:scale-[1.02]"
        >
          <Icon name="plus" size={13} />
          INVITE MEMBER
        </button>
      </div>
      <SaveBanner message={saved} />

      {showInvite && <InviteMemberForm onCancel={() => setShowInvite(false)} onInvite={handleInvite} />}

      <div className="mt-5 flex flex-col divide-y divide-hairline rounded-lg border border-hairline">
        {members.map((member) => (
          <div key={member.id} className="flex items-center justify-between gap-3 px-4 py-3.5">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-sm text-text">
                {member.name}
                <StatusBadge label={member.status} tone={TEAM_STATUS_TONE[member.status]} />
              </div>
              <div className="mt-0.5 truncate text-xs text-muted">{member.email}</div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="text-[13px] text-muted">{member.role}</span>
              {member.role !== "Owner" && (
                <button type="button" onClick={() => handleRemove(member.id)} className="text-[12px] font-semibold text-danger hover:underline">
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PrivacySection() {
  const [form, setForm] = useState(privacySettings);
  const [saved, flash] = useSavedMessage();

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    flash("Privacy preferences updated.");
  }

  return (
    <div>
      <h2 className="font-display text-lg font-semibold">Privacy</h2>
      <p className="mt-1 text-sm text-muted">Control what's visible and what NOVA shares.</p>
      <SaveBanner message={saved} />

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Profile visibility">
          <select className={inputClass} value={form.profileVisibility} onChange={(e) => update("profileVisibility", e.target.value)}>
            <option>Public</option>
            <option>Followers only</option>
            <option>Private</option>
          </select>
        </Field>
        <Field label="Analytics visibility">
          <select className={inputClass} value={form.analyticsVisibility} onChange={(e) => update("analyticsVisibility", e.target.value)}>
            <option>Public</option>
            <option>Private</option>
          </select>
        </Field>
        <Field label="Data sharing preference">
          <select className={inputClass} value={form.dataSharing} onChange={(e) => update("dataSharing", e.target.value)}>
            <option>Minimal</option>
            <option>Standard</option>
            <option>Full</option>
          </select>
        </Field>
      </div>
    </div>
  );
}

function DeleteAccountModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-sm rounded-xl border border-hairline bg-surface-2 p-6 text-center shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)]">
        <Icon name="alert" size={22} className="mx-auto text-danger" />
        <h3 className="mt-3 font-display text-base font-semibold">Delete account</h3>
        <p className="mt-2 text-[13px] leading-relaxed text-muted">
          Account deletion isn't available in this prototype yet. Reach out to support when this becomes a real,
          connected account.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded bg-accent py-2.5 text-[13px] font-semibold text-bg transition-transform hover:scale-[1.02]"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

function SecuritySection() {
  const [twoFactor, setTwoFactor] = useState(securityInfo.twoFactorEnabled);
  const [sessions, setSessions] = useState(securityInfo.activeSessions);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [saved, flash] = useSavedMessage();

  function signOutSession(id) {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    flash("Session signed out.");
  }

  return (
    <div>
      <h2 className="font-display text-lg font-semibold">Security</h2>
      <p className="mt-1 text-sm text-muted">Keep your account secure.</p>
      <SaveBanner message={saved} />

      <div className="mt-5 rounded-lg border border-hairline p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm text-text">Password</div>
            <div className="mt-0.5 text-xs text-muted">Last changed {securityInfo.passwordLastChanged}</div>
          </div>
          <button
            type="button"
            onClick={() => flash("Password changes aren't available in this demo yet.")}
            className="shrink-0 rounded border border-hairline px-3.5 py-2 text-[13px] font-semibold text-text hover:border-[#333]"
          >
            Change password
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-hairline px-4">
        <Toggle
          checked={twoFactor}
          onChange={(v) => {
            setTwoFactor(v);
            flash(v ? "Two-factor authentication enabled." : "Two-factor authentication disabled.");
          }}
          label="Two-factor authentication"
          description="Add an extra step when signing in."
        />
      </div>

      <div className="mt-5">
        <div className="text-[13px] font-medium text-muted">Active sessions</div>
        <div className="mt-2 flex flex-col divide-y divide-hairline rounded-lg border border-hairline">
          {sessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-sm text-text">
                  {session.device}
                  {session.current && <StatusBadge label="This device" tone="accent" />}
                </div>
                <div className="mt-0.5 text-xs text-muted">
                  {session.location} &middot; {session.lastActive}
                </div>
              </div>
              {!session.current && (
                <button type="button" onClick={() => signOutSession(session.id)} className="shrink-0 text-[12px] font-semibold text-danger hover:underline">
                  Sign out
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-hairline p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm text-text">Data export</div>
            <div className="mt-0.5 text-xs text-muted">Download a copy of your NOVA account data.</div>
          </div>
          <button
            type="button"
            onClick={() => flash("Your data export will be emailed to you within 24 hours.")}
            className="shrink-0 rounded border border-hairline px-3.5 py-2 text-[13px] font-semibold text-text hover:border-[#333]"
          >
            Export data
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-danger/25 bg-danger/[0.04] p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm text-text">Delete account</div>
            <div className="mt-0.5 text-xs text-muted">Permanently delete your account and all associated data.</div>
          </div>
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="shrink-0 rounded border border-danger/40 px-3.5 py-2 text-[13px] font-semibold text-danger hover:bg-danger/10"
          >
            Delete account
          </button>
        </div>
      </div>

      {showDeleteConfirm && <DeleteAccountModal onClose={() => setShowDeleteConfirm(false)} />}
    </div>
  );
}

function BillingSection() {
  const usagePct = Math.round((billingInfo.usage.used / billingInfo.usage.limit) * 100);

  return (
    <div>
      <h2 className="font-display text-lg font-semibold">Billing</h2>
      <p className="mt-1 text-sm text-muted">
        <span className="rounded bg-accent/10 px-1.5 py-0.5 text-[11px] font-semibold tracking-[0.06em] text-accent">DEMO DATA</span>{" "}
        no real payment is connected in this prototype.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-hairline bg-bg p-4">
          <div className="text-[11px] font-semibold tracking-[0.08em] text-muted">CURRENT PLAN</div>
          <div className="mt-2 font-display text-xl font-semibold">{billingInfo.plan}</div>
          <div className="mt-1 text-sm text-muted">{billingInfo.priceLabel}</div>
        </div>
        <div className="rounded-xl border border-hairline bg-bg p-4">
          <div className="text-[11px] font-semibold tracking-[0.08em] text-muted">BILLING CYCLE</div>
          <div className="mt-2 text-sm text-text">{billingInfo.billingCycle}</div>
          <div className="mt-1 text-sm text-muted">{billingInfo.paymentMethod}</div>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-hairline bg-bg p-4">
        <div className="flex items-center justify-between text-[13px]">
          <span className="text-muted">{billingInfo.usage.label}</span>
          <span className="font-semibold text-text">
            {billingInfo.usage.used} / {billingInfo.usage.limit}
          </span>
        </div>
        <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-surface-2">
          <div className="h-full rounded-full bg-accent transition-[width]" style={{ width: `${usagePct}%` }} />
        </div>
      </div>
    </div>
  );
}

function AppearanceSection() {
  const [form, setForm] = useState(appearanceSettings);
  const [saved, flash] = useSavedMessage();

  return (
    <div>
      <h2 className="font-display text-lg font-semibold">Appearance</h2>
      <p className="mt-1 text-sm text-muted">NOVA's dark, editorial look is the default and only theme right now.</p>
      <SaveBanner message={saved} />

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Theme">
          <select className={inputClass} value={form.theme} disabled>
            <option>Dark</option>
          </select>
        </Field>
        <Field label="Dashboard density">
          <select
            className={inputClass}
            value={form.dashboardDensity}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, dashboardDensity: e.target.value }));
              flash("Appearance preference saved.");
            }}
          >
            <option>Comfortable</option>
            <option>Compact</option>
          </select>
        </Field>
      </div>

      <div className="mt-4 rounded-lg border border-hairline px-4">
        <Toggle
          checked={form.compactMode}
          onChange={(v) => {
            setForm((prev) => ({ ...prev, compactMode: v }));
            flash(v ? "Compact mode enabled." : "Compact mode disabled.");
          }}
          label="Compact mode"
          description="Tighter spacing across dashboard cards."
        />
      </div>
    </div>
  );
}

const SECTION_COMPONENTS = {
  general: GeneralSection,
  profile: ProfileSection,
  notifications: NotificationsSection,
  connected: ConnectedAccountsSection,
  team: TeamSection,
  privacy: PrivacySection,
  security: SecuritySection,
  billing: BillingSection,
  appearance: AppearanceSection,
};

export function SettingsPage() {
  const [activeCategory, setActiveCategory] = useState("general");
  const ActiveSection = SECTION_COMPONENTS[activeCategory];

  return (
    <div className="mx-auto max-w-[1800px] px-5 py-6 md:px-8 md:py-8">
      <p className="mb-6 max-w-2xl text-sm text-muted">Manage your account, profile, notifications and connections.</p>

      {/* Mobile: horizontal scrollable category tabs. Desktop: vertical nav. */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1 lg:hidden">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`shrink-0 whitespace-nowrap rounded-md border px-3.5 py-2 text-[13px] font-semibold transition-colors ${
              activeCategory === cat.id ? "border-accent/40 bg-accent/10 text-accent" : "border-hairline text-muted"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
        <div className="hidden flex-col gap-0.5 lg:flex">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors ${
                activeCategory === cat.id ? "bg-surface-2 text-text" : "text-muted hover:bg-surface hover:text-text"
              }`}
            >
              <Icon name={cat.icon} size={16} />
              {cat.label}
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-hairline bg-surface p-5 md:p-7">
          <ActiveSection />
        </div>
      </div>
    </div>
  );
}
