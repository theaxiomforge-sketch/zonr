import type { DashboardData } from "../types";

export const seedData: DashboardData = {
  stats: [
    { label: "Active permits", value: "1,284", delta: "+9.2%" },
    { label: "Guest sessions today", value: "312", delta: "+14%" },
    { label: "Violations prevented", value: "87", delta: "-22 min avg response" },
    { label: "Occupancy accuracy", value: "98.4%", delta: "+6.1 pts" }
  ],
  spots: [
    {
      id: "A1",
      zone: "North Court",
      status: "resident",
      assignedUnit: "214",
      assignedResident: "Jordan Lee",
      currentPlate: "DEMO001",
      note: "Smart Decal active"
    },
    { id: "A2", zone: "North Court", status: "open", note: "Visitor-friendly spot" },
    {
      id: "A3",
      zone: "North Court",
      status: "guest",
      assignedUnit: "302",
      assignedResident: "Camila Flores",
      currentPlate: "DEMO002",
      note: "Guest pass expires in 48 min"
    },
    {
      id: "B7",
      zone: "Clubhouse",
      status: "violation",
      currentPlate: "DEMO003",
      note: "Expired session"
    },
    {
      id: "B8",
      zone: "Clubhouse",
      status: "resident",
      assignedUnit: "118",
      assignedResident: "Miles Carter",
      currentPlate: "DEMO004",
      note: "Assigned compact space"
    },
    { id: "C4", zone: "East Garage", status: "open", note: "EV-ready" },
    {
      id: "C5",
      zone: "East Garage",
      status: "guest",
      assignedUnit: "Lobby",
      assignedResident: "Delivery",
      currentPlate: "TEMP-QR",
      note: "15-minute service window"
    },
    {
      id: "C6",
      zone: "East Garage",
      status: "resident",
      assignedUnit: "441",
      assignedResident: "Avery Nguyen",
      currentPlate: "DEMO005",
      note: "Docs pending review"
    }
  ],
  permits: [
    {
      id: "permit-1",
      residentName: "Jordan Lee",
      unit: "214",
      plate: "DEMO001",
      vehicle: "Tesla Model Y",
      permitType: "smart-decal",
      status: "approved",
      registrationOnFile: true
    },
    {
      id: "permit-2",
      residentName: "Avery Nguyen",
      unit: "441",
      plate: "DEMO005",
      vehicle: "Toyota Camry",
      permitType: "temporary",
      status: "review",
      registrationOnFile: false
    },
    {
      id: "permit-3",
      residentName: "Miles Carter",
      unit: "118",
      plate: "DEMO004",
      vehicle: "Ford F-150",
      permitType: "plate-based",
      status: "approved",
      registrationOnFile: true
    }
  ],
  guestSessions: [
    {
      id: "guest-1",
      guestName: "Amelia R.",
      hostUnit: "302",
      plate: "DEMO002",
      phone: "(310) 555-0188",
      durationHours: 2,
      remainingMinutes: 48,
      expiresSoon: false,
      zone: "North Court"
    },
    {
      id: "guest-2",
      guestName: "Marcus T.",
      hostUnit: "118",
      plate: "DEMO006",
      phone: "(424) 555-0173",
      durationHours: 1,
      remainingMinutes: 11,
      expiresSoon: true,
      zone: "Clubhouse"
    },
    {
      id: "guest-3",
      guestName: "Food delivery",
      hostUnit: "Lobby",
      plate: "TEMP-QR",
      phone: "(800) 555-0100",
      durationHours: 1,
      remainingMinutes: 7,
      expiresSoon: true,
      zone: "East Garage"
    }
  ],
  violations: [
    {
      id: "violation-1",
      plate: "DEMO007",
      reason: "No permit found",
      zone: "Clubhouse",
      action: "warning",
      gpsStamp: "34.0522, -118.2437",
      photoCount: 2
    },
    {
      id: "violation-2",
      plate: "DEMO003",
      reason: "Guest time expired",
      zone: "North Court",
      action: "tow-watch",
      gpsStamp: "34.0524, -118.2440",
      photoCount: 3
    },
    {
      id: "violation-3",
      plate: "DEMO008",
      reason: "Repeat offense",
      zone: "East Garage",
      action: "tow-dispatched",
      gpsStamp: "34.0520, -118.2432",
      photoCount: 4
    }
  ]
};
