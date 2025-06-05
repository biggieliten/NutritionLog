import { View, Text, StyleSheet, Modal } from "react-native";
import { BarcodeScanner } from "./BarcodeScanner";
import { useState, useEffect } from "react";
import { useGet } from "../hooks/useGet";
import { ScanResult } from "../types/types";
import { Camera } from "expo-camera";
import { Loading } from "./Loading";
import { getSafeValue } from "../hooks/getSafeValue";

type FoodScannerModalProps = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onAddFood?: (foodData: any) => void;
};

export function FoodScannerModal({
  visible,
  setVisible,
  onAddFood,
}: FoodScannerModalProps) {
  const [barcode, setBarcode] = useState<string>("");
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(
    null
  );
  const [showMacrosModal, setShowMacrosModal] = useState(false);

  const url = `https://world.openfoodfacts.org/api/v0/product/${
    barcode || null
  }.json`;

  const { data, loading } = useGet<ScanResult>(url);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(status === "granted");
    })();
  }, []);

  useEffect(() => {
    if (barcode && data) {
      setShowMacrosModal(true);
    }
  }, [data]);

  const handleScan = (scannedBarcode: string) => {
    setBarcode(scannedBarcode);
  };

  const handleClose = () => {
    setBarcode("");
    setShowMacrosModal(false);
    setVisible(false);
  };

  if (cameraPermission === null) {
    return (
      <Modal visible={visible} animationType="slide">
        <View style={styles.container}>
          <Text>Requesting camera permission...</Text>
        </View>
      </Modal>
    );
  }

  if (cameraPermission === false) {
    return (
      <Modal visible={visible} animationType="slide">
        <View style={styles.container}>
          <Text>No access to camera</Text>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        {showMacrosModal ? (
          <View style={styles.macrosContainer}>
            <Text style={styles.title}>
              {data?.product?.product_name || "Unknown Product"}
            </Text>
            <Text style={styles.subtitle}>Nutrition per 100g</Text>

            <View style={styles.macroRow}>
              <Text style={styles.macroLabel}>Calories:</Text>
              <Text style={styles.macroValue}>
                {getSafeValue(data?.product?.nutriments?.["energy-kcal_100g"])}{" "}
                kcal
              </Text>
            </View>

            <View style={styles.macroRow}>
              <Text style={styles.macroLabel}>Protein:</Text>
              <Text style={styles.macroValue}>
                {getSafeValue(data?.product?.nutriments?.["proteins_100g"])}g
              </Text>
            </View>

            <View style={styles.macroRow}>
              <Text style={styles.macroLabel}>Carbs:</Text>
              <Text style={styles.macroValue}>
                {getSafeValue(
                  data?.product?.nutriments?.["carbohydrates_100g"]
                )}
                g
              </Text>
            </View>

            <View style={styles.macroRow}>
              <Text style={styles.macroLabel}>Fat:</Text>
              <Text style={styles.macroValue}>
                {getSafeValue(data?.product?.nutriments?.["fat_100g"])}g
              </Text>
            </View>

            <View style={styles.buttonRow}>
              <Text style={styles.button} onPress={handleClose}>
                Close
              </Text>
              {onAddFood && (
                <Text
                  style={[styles.button, styles.primaryButton]}
                  onPress={() => {
                    onAddFood(data);
                    handleClose();
                  }}
                >
                  Add Food
                </Text>
              )}
            </View>
          </View>
        ) : loading ? (
          <Loading />
        ) : (
          <BarcodeScanner onScan={handleScan} onClose={handleClose} />
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2D3E40",
  },
  macrosContainer: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2D3E40",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#D4AA7D",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 20,
  },
  macroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#5D7073",
  },
  macroLabel: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  macroValue: {
    fontSize: 16,
    color: "#D4AA7D",
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 30,
  },
  button: {
    backgroundColor: "#5D7073",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginHorizontal: 10,
    color: "#fff",
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: "#D4AA7D",
    color: "#2D3E40",
  },
});
