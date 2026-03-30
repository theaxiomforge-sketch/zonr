import { seedData } from "../data/seed";
import type { DashboardData, GuestSession, Permit, Spot, Violation, ViolationAction } from "../types";

const NETWORK_DELAY_MS = 180;

let db: DashboardData = structuredClone(seedData);

function wait<T>(value: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), NETWORK_DELAY_MS);
  });
}

export function fetchDashboard() {
  return wait(structuredClone(db));
}

export function createGuestSession(input: {
  guestName: string;
  hostUnit: string;
  plate: string;
  phone: string;
  durationHours: number;
  zone: string;
}) {
  const session: GuestSession = {
    id: `guest-${crypto.randomUUID()}`,
    guestName: input.guestName,
    hostUnit: input.hostUnit,
    plate: input.plate.toUpperCase(),
    phone: input.phone,
    durationHours: input.durationHours,
    remainingMinutes: input.durationHours * 60,
    expiresSoon: false,
    zone: input.zone
  };

  db.guestSessions = [session, ...db.guestSessions];

  const openSpot = db.spots.find((spot) => spot.zone === input.zone && spot.status === "open");
  if (openSpot) {
    openSpot.status = "guest";
    openSpot.currentPlate = session.plate;
    openSpot.assignedUnit = input.hostUnit;
    openSpot.assignedResident = input.guestName;
    openSpot.note = `Guest pass active for ${input.durationHours}h`;
  }

  return wait(structuredClone(session));
}

export function updatePermit(input: {
  id: string;
  status?: Permit["status"];
  plate?: string;
  vehicle?: string;
  registrationOnFile?: boolean;
}) {
  db.permits = db.permits.map((permit) =>
    permit.id === input.id
      ? {
          ...permit,
          ...input,
          plate: input.plate ? input.plate.toUpperCase() : permit.plate
        }
      : permit
  );

  const updated = db.permits.find((permit) => permit.id === input.id);
  return wait(structuredClone(updated));
}

export function assignSpot(input: {
  id: string;
  assignedUnit: string;
  assignedResident: string;
  status: Spot["status"];
  currentPlate?: string;
}) {
  db.spots = db.spots.map((spot) =>
    spot.id === input.id
      ? {
          ...spot,
          assignedUnit: input.assignedUnit,
          assignedResident: input.assignedResident,
          status: input.status,
          currentPlate: input.currentPlate,
          note: `${input.status} assignment updated`
        }
      : spot
  );

  const updated = db.spots.find((spot) => spot.id === input.id);
  return wait(structuredClone(updated));
}

export function createViolation(input: {
  plate: string;
  reason: string;
  zone: string;
  action: ViolationAction;
}) {
  const violation: Violation = {
    id: `violation-${crypto.randomUUID()}`,
    plate: input.plate.toUpperCase(),
    reason: input.reason,
    zone: input.zone,
    action: input.action,
    gpsStamp: "34.0523, -118.2438",
    photoCount: 1
  };

  db.violations = [violation, ...db.violations];
  db.spots = db.spots.map((spot) =>
    spot.currentPlate === violation.plate
      ? { ...spot, status: "violation", note: violation.reason }
      : spot
  );

  return wait(structuredClone(violation));
}
