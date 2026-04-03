import { GPSTrackPoint, SportType } from "@/shared/types/models";

export interface RecordingMetrics {
  elapsedTimeSeconds: number;
  movingTimeSeconds: number;
  distanceMeters: number;
  averagePaceSecondsPerKm?: number;
  averageSpeedKph?: number;
  elevationGainMeters: number;
}

export interface RecordingSession {
  id: string;
  sportType: SportType;
  status: "idle" | "recording" | "paused" | "saving";
  startedAt?: string;
  endedAt?: string;
  points: GPSTrackPoint[];
  metrics: RecordingMetrics;
}

export interface TrackingService {
  requestPermissions(): Promise<{ foreground: boolean; background: boolean }>;
  startSession(sportType: SportType): Promise<void>;
  pauseSession(): Promise<void>;
  resumeSession(): Promise<void>;
  stopSession(): Promise<RecordingSession>;
}
