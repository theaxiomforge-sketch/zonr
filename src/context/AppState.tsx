import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren
} from "react";
import {
  assignSpot,
  createGuestSession,
  createViolation,
  fetchDashboard,
  updatePermit
} from "../services/mockApi";
import type { DashboardData, Permit, Spot, ViolationAction } from "../types";

type AppStateValue = {
  data: DashboardData | null;
  isLoading: boolean;
  createGuest: (input: {
    guestName: string;
    hostUnit: string;
    plate: string;
    phone: string;
    durationHours: number;
    zone: string;
  }) => Promise<void>;
  savePermit: (input: {
    id: string;
    status?: Permit["status"];
    plate?: string;
    vehicle?: string;
    registrationOnFile?: boolean;
  }) => Promise<void>;
  saveSpotAssignment: (input: {
    id: string;
    assignedUnit: string;
    assignedResident: string;
    status: Spot["status"];
    currentPlate?: string;
  }) => Promise<void>;
  logViolation: (input: {
    plate: string;
    reason: string;
    zone: string;
    action: ViolationAction;
  }) => Promise<void>;
};

const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: PropsWithChildren) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetchDashboard().then((nextData) => {
      if (!active) {
        return;
      }

      startTransition(() => {
        setData(nextData);
        setIsLoading(false);
      });
    });

    return () => {
      active = false;
    };
  }, []);

  const value: AppStateValue = {
    data,
    isLoading,
    async createGuest(input) {
      const session = await createGuestSession(input);
      setData((current) =>
        current
          ? {
              ...current,
              guestSessions: [session, ...current.guestSessions],
              spots: current.spots.map((spot) =>
                spot.zone === session.zone && spot.status === "open"
                  ? {
                      ...spot,
                      status: "guest",
                      currentPlate: session.plate,
                      assignedUnit: session.hostUnit,
                      assignedResident: session.guestName,
                      note: `Guest pass active for ${session.durationHours}h`
                    }
                  : spot
              ),
              stats: current.stats.map((stat) =>
                stat.label === "Guest sessions today"
                  ? {
                      ...stat,
                      value: String(Number.parseInt(stat.value.replace(/,/g, ""), 10) + 1)
                    }
                  : stat
              )
            }
          : current
      );
    },
    async savePermit(input) {
      const permit = await updatePermit(input);
      if (!permit) {
        return;
      }

      setData((current) =>
        current
          ? {
              ...current,
              permits: current.permits.map((item) => (item.id === permit.id ? permit : item))
            }
          : current
      );
    },
    async saveSpotAssignment(input) {
      const spot = await assignSpot(input);
      if (!spot) {
        return;
      }

      setData((current) =>
        current
          ? {
              ...current,
              spots: current.spots.map((item) => (item.id === spot.id ? spot : item))
            }
          : current
      );
    },
    async logViolation(input) {
      const violation = await createViolation(input);
      setData((current) =>
        current
          ? {
              ...current,
              violations: [violation, ...current.violations],
              spots: current.spots.map((spot) =>
                spot.currentPlate === violation.plate
                  ? { ...spot, status: "violation", note: violation.reason }
                  : spot
              )
            }
          : current
      );
    }
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const value = useContext(AppStateContext);
  if (!value) {
    throw new Error("useAppState must be used inside AppStateProvider");
  }

  return value;
}
