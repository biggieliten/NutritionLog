import { View, Text, StyleSheet, Pressable } from "react-native";
import { CameraView } from "expo-camera";
import { useState, useEffect } from "react";
import { BarcodeScanningResult } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";

type BarcodeScannerProps = {
  onScan: (barcode: string) => void;
  onClose?: () => void;
};

export function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const [flashState, setFlashState] = useState(false);
  const [upcScanned, setUpcScanned] = useState<boolean>(false);

  const handleBarcodeScan = (result: BarcodeScanningResult) => {
    if (result?.data && !upcScanned) {
      setUpcScanned(true);
      onScan(result.data);
    }
  };

  return (
    <View style={styles.cameraContainer}>
      <CameraView
        style={styles.camera}
        barcodeScannerSettings={{
          barcodeTypes: ["upc_a", "upc_e", "ean13", "ean8"],
        }}
        enableTorch={flashState}
        onBarcodeScanned={upcScanned ? undefined : handleBarcodeScan}
      />
      <View style={styles.overlay}>
        <View style={styles.scanArea}>
          <Text style={styles.scanAreaText}>Scan barcode here</Text>
        </View>
      </View>

      {upcScanned && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>Loading product...</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.button}
          onPress={() => setFlashState(!flashState)}
        >
          <Ionicons
            name={flashState ? "flash" : "flash-off"}
            size={24}
            color="white"
          />
          <Text style={styles.buttonText}>Flash</Text>
        </Pressable>

        {onClose && (
          <Pressable style={styles.button} onPress={onClose}>
            <Ionicons name="close-circle" size={24} color="white" />
            <Text style={styles.buttonText}>Close</Text>
          </Pressable>
        )}

        <Pressable style={styles.button} onPress={() => setUpcScanned(false)}>
          <Ionicons name="scan-outline" size={24} color="white" />
          <Text style={styles.buttonText}>
            {upcScanned ? "Scan Again" : "Scanning..."}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    position: "relative",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderRadius: 15,
    borderColor: "#D4AA7D",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  scanAreaText: {
    color: "#D4AA7D",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  loadingText: {
    color: "white",
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    backgroundColor: "#2D3E40",
  },
  button: {
    backgroundColor: "#436164",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    marginLeft: 8,
    fontSize: 16,
  },
});
