import { View, Text, StyleSheet, Pressable } from "react-native";
import { CameraView } from "expo-camera";
import { useContext, useEffect, useState } from "react";
import { BarcodeScanningResult } from "expo-camera";
import { GlobalContext } from "../state/GlobalState/GlobalContext";
import { UPC } from "../types/types";
import { useGet } from "../hooks/useGet";

export default function Scanner() {
  const [flashState, setFlashState] = useState(false);
  const [upcScanned, setUpcScanned] = useState<boolean>(true);
  const {
    setScannedUPC,
    scannedUPC,
    setUPCContent: setUPCContent,
  } = useContext(GlobalContext);
  const UPCURL = `https://world.openfoodfacts.org/api/v0/product/${
    scannedUPC || null
  }.json`;
  //   const UPCURL = `https://world.openfoodfacts.org/api/v0/product/7318690499541.json`;
  const { data } = useGet<UPC>(UPCURL);

  const handleBarcodeScan = (upc: BarcodeScanningResult) => {
    if (upc != null && upcScanned === false) {
      setScannedUPC(upc.data);
      setUpcScanned(true);
    }
  };

  useEffect(() => {
    if (data) {
      setUPCContent(data);
    }
  }, [data, setUPCContent]);

  return (
    <>
      <View style={styles.container}>
        <CameraView
          style={styles.camera}
          barcodeScannerSettings={{ barcodeTypes: ["upc_a", "upc_e", "ean13"] }}
          enableTorch={flashState}
          onBarcodeScanned={(upc) =>
            handleBarcodeScan(upc as BarcodeScanningResult)
          }
        />
        <Pressable
          style={styles.scanButton}
          onPress={() => setUpcScanned(false)}
        >
          <Text>Scan</Text>
        </Pressable>
        <Pressable
          style={styles.flashButton}
          onPress={() => setFlashState(!flashState)}
        >
          <Text>Flash</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  flashButton: {
    position: "absolute",
    bottom: 30,
    marginLeft: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
  },
  scanButton: {
    position: "absolute",
    bottom: 30,
    marginLeft: 80,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
  },
});
