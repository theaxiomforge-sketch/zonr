import { useState } from "react";
import { Panel, SectionHeading } from "../components/Shared";
import { useAppState } from "../context/AppState";
import type { Spot } from "../types";

export function ManagerPage() {
  const { data, isLoading, saveSpotAssignment } = useAppState();
  const [selectedSpotId, setSelectedSpotId] = useState<string>("");
  const [assignedUnit, setAssignedUnit] = useState("");
  const [assignedResident, setAssignedResident] = useState("");
  const [currentPlate, setCurrentPlate] = useState("");
  const [status, setStatus] = useState<Spot["status"]>("resident");

  if (isLoading || !data) {
    return <div className="loading-state">Loading manager workspace...</div>;
  }

  const selectedSpot = data.spots.find((spot) => spot.id === selectedSpotId);

  return (
    <section className="workspace">
      <SectionHeading
        eyebrow="Property Manager"
        title="Assign spaces, monitor occupancy, and orchestrate enforcement"
        description="The smart map, permit roster, and incident activity all respond to the same source of truth."
      />

      <div className="workspace-grid">
        <Panel kicker="Interactive Smart Map" title="Live occupancy by zone" badge="Drag-and-drop ready" large>
          <div className="map-legend">
            <Legend color="green" label="Available / Open" />
            <Legend color="blue" label="Occupied by Resident" />
            <Legend color="yellow" label="Guest Active" />
            <Legend color="red" label="Violation Detected" />
          </div>
          <div className="spot-grid">
            {data.spots.map((spot) => (
              <button
                type="button"
                className={`spot ${spot.status} ${selectedSpotId === spot.id ? "selected" : ""}`}
                key={spot.id}
                onClick={() => {
                  setSelectedSpotId(spot.id);
                  setAssignedUnit(spot.assignedUnit ?? "");
                  setAssignedResident(spot.assignedResident ?? "");
                  setCurrentPlate(spot.currentPlate ?? "");
                  setStatus(spot.status);
                }}
              >
                <strong>{spot.id}</strong>
                <span>{spot.zone}</span>
                <small>{spot.note ?? "Ready to assign"}</small>
              </button>
            ))}
          </div>
        </Panel>

        <Panel kicker="Assignment Editor" title="Update a selected space" badge={selectedSpot?.id ?? "Pick a spot"}>
          <form
            className="form-preview"
            onSubmit={(event) => {
              event.preventDefault();
              if (!selectedSpotId) {
                return;
              }

              void saveSpotAssignment({
                id: selectedSpotId,
                assignedUnit,
                assignedResident,
                currentPlate,
                status
              });
            }}
          >
            <label>
              Unit
              <input value={assignedUnit} onChange={(event) => setAssignedUnit(event.target.value)} />
            </label>
            <label>
              Resident or guest
              <input
                value={assignedResident}
                onChange={(event) => setAssignedResident(event.target.value)}
              />
            </label>
            <label>
              Plate
              <input value={currentPlate} onChange={(event) => setCurrentPlate(event.target.value)} />
            </label>
            <label>
              Status
              <select value={status} onChange={(event) => setStatus(event.target.value as Spot["status"])}>
                <option value="resident">Resident</option>
                <option value="guest">Guest</option>
                <option value="open">Open</option>
                <option value="violation">Violation</option>
              </select>
            </label>
            <button type="submit" className="primary-button full-width">
              Save assignment
            </button>
          </form>
        </Panel>

        <Panel kicker="Permit Queue" title="Residents needing attention" badge="PMS sync next">
          <div className="stack-list">
            {data.permits.map((permit) => (
              <div className="list-row" key={permit.id}>
                <div>
                  <strong>
                    {permit.residentName} · Unit {permit.unit}
                  </strong>
                  <span>
                    {permit.vehicle} · {permit.plate}
                  </span>
                </div>
                <div>
                  <strong>{permit.status}</strong>
                  <span>{permit.registrationOnFile ? "Docs on file" : "Awaiting docs"}</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel kicker="Violation Feed" title="Active incident roster" badge={`${data.violations.length} active`}>
          <div className="stack-list">
            {data.violations.map((violation) => (
              <div className="list-row" key={violation.id}>
                <div>
                  <strong>{violation.plate}</strong>
                  <span>{violation.reason}</span>
                </div>
                <div>
                  <strong>{violation.action}</strong>
                  <span>{violation.zone}</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </section>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="legend-item">
      <span className={`legend-dot ${color}`} />
      <span>{label}</span>
    </div>
  );
}
