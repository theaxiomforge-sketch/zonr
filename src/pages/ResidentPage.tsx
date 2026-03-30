import { useDeferredValue, useState } from "react";
import { Panel, SectionHeading } from "../components/Shared";
import { useAppState } from "../context/AppState";
import type { Permit } from "../types";

export function ResidentPage() {
  const { data, isLoading, savePermit } = useAppState();
  const [selectedId, setSelectedId] = useState<string>("permit-1");
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  if (isLoading || !data) {
    return <div className="loading-state">Loading resident portal...</div>;
  }

  const filteredPermits = data.permits.filter((permit) => {
    const query = deferredSearch.trim().toLowerCase();
    if (!query) {
      return true;
    }

    return [permit.residentName, permit.vehicle, permit.plate, permit.unit].some((value) =>
      value.toLowerCase().includes(query)
    );
  });

  const selectedPermit = data.permits.find((permit) => permit.id === selectedId) ?? data.permits[0];

  return (
    <section className="workspace">
      <SectionHeading
        eyebrow="Resident Portal"
        title="Self-service permits with manager-friendly review context"
        description="Vehicle changes update locally now and can later be wired straight into a real permits API."
      />

      <div className="workspace-grid">
        <Panel kicker="Permit Directory" title="Find a resident vehicle" badge={`${filteredPermits.length} matches`}>
          <label className="search-field">
            Search residents, units, vehicles, or plates
            <input value={search} onChange={(event) => setSearch(event.target.value)} />
          </label>
          <div className="stack-list compact">
            {filteredPermits.map((permit) => (
              <button
                type="button"
                key={permit.id}
                className={`list-row selectable ${selectedPermit.id === permit.id ? "active" : ""}`}
                onClick={() => setSelectedId(permit.id)}
              >
                <div>
                  <strong>{permit.residentName}</strong>
                  <span>
                    Unit {permit.unit} · {permit.vehicle}
                  </span>
                </div>
                <div>
                  <strong>{permit.status}</strong>
                  <span>{permit.plate}</span>
                </div>
              </button>
            ))}
          </div>
        </Panel>

        <Panel kicker="Permit Editor" title="Update resident permit details" badge={selectedPermit.plate}>
          <PermitEditor key={selectedPermit.id} permit={selectedPermit} onSave={savePermit} />
        </Panel>
      </div>
    </section>
  );
}

function PermitEditor({
  permit,
  onSave
}: {
  permit: Permit;
  onSave: (input: {
    id: string;
    status?: Permit["status"];
    plate?: string;
    vehicle?: string;
    registrationOnFile?: boolean;
  }) => Promise<void>;
}) {
  const [vehicle, setVehicle] = useState(permit.vehicle);
  const [plate, setPlate] = useState(permit.plate);
  const [status, setStatus] = useState<Permit["status"]>(permit.status);
  const [registrationOnFile, setRegistrationOnFile] = useState(permit.registrationOnFile);

  return (
    <form
      className="form-preview"
      onSubmit={(event) => {
        event.preventDefault();
        void onSave({ id: permit.id, vehicle, plate, status, registrationOnFile });
      }}
    >
      <label>
        Resident
        <input value={`${permit.residentName} · Unit ${permit.unit}`} readOnly />
      </label>
      <label>
        Vehicle
        <input value={vehicle} onChange={(event) => setVehicle(event.target.value)} />
      </label>
      <label>
        Plate
        <input value={plate} onChange={(event) => setPlate(event.target.value)} />
      </label>
      <label>
        Permit status
        <select value={status} onChange={(event) => setStatus(event.target.value as Permit["status"])}>
          <option value="approved">Approved</option>
          <option value="review">Review needed</option>
          <option value="revoked">Revoked</option>
        </select>
      </label>
      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={registrationOnFile}
          onChange={(event) => setRegistrationOnFile(event.target.checked)}
        />
        Registration document on file
      </label>
      <button type="submit" className="primary-button full-width">
        Save permit
      </button>
    </form>
  );
}
