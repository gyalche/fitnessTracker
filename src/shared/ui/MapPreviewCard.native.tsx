import { View } from "react-native";
import MapView, { Polyline } from "react-native-maps";

import { GPSTrackPoint } from "@/shared/types/models";
import { colors } from "@/theme/colors";

export function MapPreviewCard({ points, height = 180 }: { points: GPSTrackPoint[]; height?: number }) {
  const initialRegion = {
    latitude: points[0]?.lat ?? 37.78825,
    longitude: points[0]?.lng ?? -122.4324,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02
  };

  return (
    <View
      style={{
        height,
        overflow: "hidden",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.border
      }}
    >
      <MapView
        initialRegion={initialRegion}
        mapType="mutedStandard"
        pitchEnabled={false}
        rotateEnabled={false}
        scrollEnabled={false}
        style={{ flex: 1 }}
        zoomEnabled={false}
      >
        <Polyline
          coordinates={points.map((point) => ({ latitude: point.lat, longitude: point.lng }))}
          strokeColor={colors.primary}
          strokeWidth={4}
        />
      </MapView>
    </View>
  );
}
