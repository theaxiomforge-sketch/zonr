export type RoleKey = "overview" | "manager" | "resident" | "guest" | "enforcement";

export type SpotStatus = "open" | "resident" | "guest" | "violation";

export type Spot = {
  id: string;
  zone: string;
  status: SpotStatus;
  assignedUnit?: string;
  assignedResident?: string;
  currentPlate?: string;
  note?: string;
};

export type PermitStatus = "approved" | "review" | "revoked";

export type Permit = {
  id: string;
  residentName: string;
  unit: string;
  plate: string;
  vehicle: string;
  permitType: "smart-decal" | "plate-based" | "temporary";
  status: PermitStatus;
  registrationOnFile: boolean;
};

export type GuestSession = {
  id: string;
  guestName: string;
  hostUnit: string;
  plate: string;
  phone: string;
  durationHours: number;
  remainingMinutes: number;
  expiresSoon: boolean;
  zone: string;
};

export type ViolationAction = "warning" | "citation" | "tow-watch" | "tow-dispatched";

export type Violation = {
  id: string;
  plate: string;
  reason: string;
  zone: string;
  action: ViolationAction;
  gpsStamp: string;
  photoCount: number;
};

export type Stat = {
  label: string;
  value: string;
  delta: string;
};

export type DashboardData = {
  stats: Stat[];
  spots: Spot[];
  permits: Permit[];
  guestSessions: GuestSession[];
  violations: Violation[];
};
