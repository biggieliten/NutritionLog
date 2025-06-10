import { View, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { useAuth } from "../state/AuthState/AuthContext";
import { ScanResult } from "../types/types";
import { BarcodeScanner } from "../components/BarcodeScanner";
import { useGet } from "../hooks/useGet";

export default function Scanner() {
  const [barcode, setBarcode] = useState<string>("");
  const { setScannedProduct } = useAuth();

  const url = `https://world.openfoodfacts.org/api/v0/product/${
    barcode || null
  }.json`;

  const { data } = useGet<ScanResult>(url);

  const handleScan = (scannedBarcode: string) => {
    setBarcode(scannedBarcode);
  };

  useEffect(() => {
    if (barcode) {
      if (data) {
        setScannedProduct(data);
        console.log(`data set:${data}`);
        router.replace("/Menu");
        console.log("product._id", data.product._id);
      } else {
        alert("No product found for this barcode");
        setBarcode("");
      }
    }
  }, [data]);

  return (
    <View style={styles.container}>
      <BarcodeScanner onScan={handleScan} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2D3E40",
  },
});
