import { useState } from "react";
import { Panel, SectionHeading } from "../components/Shared";
import { useAppState } from "../context/AppState";
import type { ViolationAction } from "../types";

export function EnforcementPage() {
  const { data, isLoading, logViolation } = useAppState();
  const [plate, setPlate] = useState("DEMO008");
  const [reason, setReason] = useState("Unauthorized vehicle");
  const [zone, setZone] = useState("East Garage");
  const [action, setAction] = useState<ViolationAction>("warning");

  if (isLoading || !data) {
    return <div className="loading-state">Loading patrol tools...</div>;
  }

  return (
    <section className="workspace">
      <SectionHeading
        eyebrow="Enforcement"
        title="Verify plates, create incidents, and escalate repeat offenders"
        description="Patrol activity updates the incident roster and flips related spots into violation state."
      />

      <div className="workspace-grid">
        <Panel kicker="LPR Scan" title="Mobile patrol view" badge="Camera-ready">
          <div className="scanner-card">
            <span className="camera-badge">Live recognition</span>
            <div className="scanner-frame">
              <div className="scanner-line" />
              <strong>{plate}</strong>
              <span>Permit status checked against Zonr records</span>
            </div>
          </div>
          <form
            className="form-preview compact-top"
            onSubmit={(event) => {
              event.preventDefault();
              void logViolation({ plate, reason, zone, action });
            }}
          >
            <label>
              Plate
              <input value={plate} onChange={(event) => setPlate(event.target.value)} />
            </label>
            <label>
              Reason
              <input value={reason} onChange={(event) => setReason(event.target.value)} />
            </label>
            <label>
              Zone
              <select value={zone} onChange={(event) => setZone(event.target.value)}>
                <option value="North Court">North Court</option>
                <option value="Clubhouse">Clubhouse</option>
                <option value="East Garage">East Garage</option>
              </select>
            </label>
            <label>
              Action
              <select value={action} onChange={(event) => setAction(event.target.value as ViolationAction)}>
                <option value="warning">Warning</option>
                <option value="citation">Citation</option>
                <option value="tow-watch">Tow watchlist</option>
                <option value="tow-dispatched">Tow dispatched</option>
              </select>
            </label>
            <button type="submit" className="primary-button full-width">
              Log violation
            </button>
          </form>
        </Panel>

        <Panel kicker="Incident Feed" title="Recorded patrol activity" badge={`${data.violations.length} incidents`}>
          <div className="stack-list">
            {data.violations.map((violation) => (
              <div className="list-row" key={violation.id}>
                <div>
                  <strong>{violation.plate}</strong>
                  <span>
                    {violation.reason} · {violation.photoCount} photo(s)
                  </span>
                </div>
                <div>
                  <strong>{violation.action}</strong>
                  <span>
                    {violation.zone} · {violation.gpsStamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </section>
  );
}
