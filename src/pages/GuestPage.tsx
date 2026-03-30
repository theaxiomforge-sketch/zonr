import { useState } from "react";
import { Panel, SectionHeading } from "../components/Shared";
import { useAppState } from "../context/AppState";

export function GuestPage() {
  const { data, isLoading, createGuest } = useAppState();
  const [guestName, setGuestName] = useState("");
  const [hostUnit, setHostUnit] = useState("");
  const [plate, setPlate] = useState("");
  const [phone, setPhone] = useState("");
  const [durationHours, setDurationHours] = useState("2");
  const [zone, setZone] = useState("North Court");

  if (isLoading || !data) {
    return <div className="loading-state">Loading guest portal...</div>;
  }

  return (
    <section className="workspace">
      <SectionHeading
        eyebrow="Guest Portal"
        title="Simulate the QR registration experience"
        description="This is the no-download guest flow: capture a plate, phone number, stay duration, and parking zone."
      />

      <div className="workspace-grid">
        <Panel kicker="Virtual Parking Attendant" title="Register a guest session" badge="QR entry">
          <form
            className="form-preview"
            onSubmit={(event) => {
              event.preventDefault();

              void createGuest({
                guestName,
                hostUnit,
                plate,
                phone,
                durationHours: Number(durationHours),
                zone
              });

              setGuestName("");
              setHostUnit("");
              setPlate("");
              setPhone("");
              setDurationHours("2");
              setZone("North Court");
            }}
          >
            <label>
              Guest name
              <input value={guestName} onChange={(event) => setGuestName(event.target.value)} required />
            </label>
            <label>
              Host unit
              <input value={hostUnit} onChange={(event) => setHostUnit(event.target.value)} required />
            </label>
            <label>
              License plate
              <input value={plate} onChange={(event) => setPlate(event.target.value)} required />
            </label>
            <label>
              Phone number
              <input value={phone} onChange={(event) => setPhone(event.target.value)} required />
            </label>
            <label>
              Duration
              <select value={durationHours} onChange={(event) => setDurationHours(event.target.value)}>
                <option value="1">1 hour</option>
                <option value="2">2 hours</option>
                <option value="4">4 hours</option>
                <option value="8">8 hours</option>
              </select>
            </label>
            <label>
              Parking zone
              <select value={zone} onChange={(event) => setZone(event.target.value)}>
                <option value="North Court">North Court</option>
                <option value="Clubhouse">Clubhouse</option>
                <option value="East Garage">East Garage</option>
              </select>
            </label>
            <button type="submit" className="primary-button full-width">
              Start guest session
            </button>
          </form>
        </Panel>

        <Panel kicker="Live Sessions" title="Guest activity" badge={`${data.guestSessions.length} sessions`}>
          <div className="stack-list">
            {data.guestSessions.map((session) => (
              <div className="list-row" key={session.id}>
                <div>
                  <strong>{session.guestName}</strong>
                  <span>
                    {session.plate} · Host {session.hostUnit}
                  </span>
                </div>
                <div>
                  <strong>{session.remainingMinutes} min left</strong>
                  <span>{session.zone}</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </section>
  );
}
