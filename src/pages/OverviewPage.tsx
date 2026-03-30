import { Link } from "react-router-dom";
import { Panel, SectionHeading } from "../components/Shared";
import { useAppState } from "../context/AppState";

const roleCards = [
  {
    title: "Property Manager",
    text: "Monitor occupancy, drag assignments across spots, and keep policy enforcement visible.",
    link: "/manager",
    cta: "Open manager workspace"
  },
  {
    title: "Resident",
    text: "Update vehicles, upload docs, and manage permits without office back-and-forth.",
    link: "/resident",
    cta: "Open resident portal"
  },
  {
    title: "Guest",
    text: "Launch QR-based sessions with no app download and clear extension-ready timing.",
    link: "/guest",
    cta: "Open guest flow"
  },
  {
    title: "Enforcement",
    text: "Verify plates in the field, log incidents, and escalate repeat offenders faster.",
    link: "/enforcement",
    cta: "Open patrol tools"
  }
];

export function OverviewPage() {
  const { data, isLoading } = useAppState();

  if (isLoading || !data) {
    return <div className="loading-state">Loading Zonr workspace...</div>;
  }

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">Proptech parking orchestration</div>
          <h1>Zonr turns every residential lot into a live, enforceable system.</h1>
          <p className="hero-text">
            Replace hangtags, disconnected spreadsheets, and manual patrol ambiguity
            with digital permits, smart guest sessions, interactive maps, and
            enforcement-grade verification.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" to="/manager">
              Explore manager view
            </Link>
            <Link className="secondary-button" to="/guest">
              Launch guest portal
            </Link>
          </div>
        </div>
        <div className="hero-panel">
          <div className="signal-card">
            <span className="signal-label">Live Ops</span>
            <strong>{data.spots.length} spots monitored</strong>
            <p>
              {data.guestSessions.length} guest sessions, {data.violations.length} active
              incidents, 2 tow escalations pending.
            </p>
          </div>
          <div className="signal-card alt">
            <span className="signal-label">Smart Decals</span>
            <strong>
              {data.permits.filter((permit) => permit.permitType === "smart-decal").length} decal
              accounts live
            </strong>
            <p>Residents are moving from stickers and office visits to self-managed permits.</p>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        {data.stats.map((stat) => (
          <article className="stat-card" key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
            <em>{stat.delta}</em>
          </article>
        ))}
      </section>

      <section className="role-strip">
        {roleCards.map((role) => (
          <article className="role-card" key={role.title}>
            <span>{role.title}</span>
            <h2>{role.title}</h2>
            <p>{role.text}</p>
            <Link className="secondary-button" to={role.link}>
              {role.cta}
            </Link>
          </article>
        ))}
      </section>

      <section className="workspace">
        <SectionHeading
          eyebrow="Blueprint"
          title="What this app now covers"
          description="The routed experience mirrors Zonr's four core operating roles while keeping one shared source of parking truth."
        />
        <div className="workspace-grid">
          <Panel kicker="Manager" title="Interactive Smart Map" badge="Shared live data">
            <p className="panel-copy">
              Unit assignments, occupancy status, and violations update inside the same app
              state the other roles consume.
            </p>
          </Panel>
          <Panel kicker="Resident" title="Permit lifecycle" badge="Editable">
            <p className="panel-copy">
              Residents can revise vehicle details while managers review docs and status.
            </p>
          </Panel>
          <Panel kicker="Guest" title="QR session simulation" badge="Create sessions">
            <p className="panel-copy">
              New guest registrations allocate spaces and immediately show up in operations.
            </p>
          </Panel>
          <Panel kicker="Enforcement" title="Violation logging" badge="Tow-ready">
            <p className="panel-copy">
              Patrol actions create records and flip mapped spaces into violation state.
            </p>
          </Panel>
        </div>
      </section>
    </>
  );
}
