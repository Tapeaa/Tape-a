import { Capacitor } from "@capacitor/core";
import { Geolocation, type PositionOptions } from "@capacitor/geolocation";

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
}

export interface GeoPosition {
  coords: GeoCoordinates;
  timestamp: number;
}

export type GeoWatchId = string | number;

export function isGeolocationAvailable(): boolean {
  return typeof navigator !== "undefined" && !!navigator.geolocation;
}

function toGeoPosition(position: { coords: GeoCoordinates; timestamp: number }): GeoPosition {
  return {
    coords: {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      altitude: position.coords.altitude ?? null,
      altitudeAccuracy: position.coords.altitudeAccuracy ?? null,
      heading: position.coords.heading ?? null,
      speed: position.coords.speed ?? null,
    },
    timestamp: position.timestamp,
  };
}

export async function getCurrentPosition(options?: PositionOptions): Promise<GeoPosition> {
  if (Capacitor.isNativePlatform()) {
    const position = await Geolocation.getCurrentPosition(options);
    return toGeoPosition(position);
  }

  if (!isGeolocationAvailable()) {
    throw new Error("Geolocation is not supported");
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(toGeoPosition(position)),
      (error) => reject(error),
      options
    );
  });
}

export function watchPosition(
  options: PositionOptions,
  onSuccess: (position: GeoPosition) => void,
  onError?: (error: GeolocationPositionError) => void
): GeoWatchId {
  if (Capacitor.isNativePlatform()) {
    return Geolocation.watchPosition(options, (position, error) => {
      if (error) {
        onError?.(error);
        return;
      }

      if (position) {
        onSuccess(toGeoPosition(position));
      }
    });
  }

  if (!isGeolocationAvailable()) {
    throw new Error("Geolocation is not supported");
  }

  return navigator.geolocation.watchPosition(
    (position) => onSuccess(toGeoPosition(position)),
    onError,
    options
  );
}

export function clearWatch(watchId: GeoWatchId): void {
  if (Capacitor.isNativePlatform() && typeof watchId === "string") {
    void Geolocation.clearWatch({ id: watchId });
    return;
  }

  if (typeof watchId === "number" && isGeolocationAvailable()) {
    navigator.geolocation.clearWatch(watchId);
  }
}
