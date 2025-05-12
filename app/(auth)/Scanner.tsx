import { View, Text, StyleSheet, Pressable } from "react-native";
import { Camera, CameraView } from "expo-camera";
import { useContext, useEffect, useState } from "react";
import { BarcodeScanningResult } from "expo-camera";
import { ScanResult } from "../types/types";
import { useGet } from "../hooks/useGet";
// import { useScannedProductStore } from "../store/useScannedProductsStore";
import { useAuth } from "../state/AuthState/AuthContext";

export default function Scanner() {
  //   const {
  //     setScannedUPC,
  //     scannedUPC,
  //     setUPCContent: setUPCContent,
  //   } = useContext(GlobalContext);
  //   const UPCURL = `https://world.openfoodfacts.org/api/v0/product/${
  //     scannedUPC || null
  //   }.json`;
  //   const UPCURL = `https://world.openfoodfacts.org/api/v0/product/4030300022682.json`;
  //   const UPCURL = `https://world.openfoodfacts.org/api/v0/product/7318690499541.json`;

  //   const { scannedProduct, setScannedProduct } = useScannedProductStore();
  const [flashState, setFlashState] = useState(false);
  const [upcScanned, setUpcScanned] = useState<boolean>(true);
  const [barcode, setBarcode] = useState<string>("");
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(
    null
  );
  const url = `https://world.openfoodfacts.org/api/v0/product/${
    barcode || null
  }.json`;
  const { setScannedProduct } = useAuth();
  const { data } = useGet<ScanResult>(url);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(status === "granted");
    })();
  }, []);

  const handleBarcodeScan = (product: BarcodeScanningResult) => {
    if (product != null && upcScanned === false) {
      setScannedProduct(data);
      setUpcScanned(true);
    }
  };

  //Setting the global state for fetched product data on scan
  useEffect(() => {
    if (data) {
      setScannedProduct(data);
      console.log(`data set:${data}`);
    }
  }, [data, setScannedProduct, barcode]);

  if (cameraPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }

  if (cameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        barcodeScannerSettings={{ barcodeTypes: ["upc_a", "upc_e", "ean13"] }}
        enableTorch={flashState}
        onBarcodeScanned={(barcode) =>
          handleBarcodeScan(barcode as BarcodeScanningResult)
        }
      />
      <Pressable
        // style={styles.scanButton}
        onPress={() => {
          setBarcode("7318690499541");
          console.log("barcode:", barcode);
          // ,console.log(
          //   `barcode set:${barcode}, scannedPc${scannedProduct.code}`
          // );
        }}
      >
        <Text>Set barcode</Text>
      </Pressable>
      <Pressable
        // style={styles.scanButton}
        onPress={() => {
          setBarcode("3017620422003");
        }}
      >
        <Text>Set barcode 2</Text>
      </Pressable>
      <Pressable style={styles.scanButton} onPress={() => setUpcScanned(false)}>
        <Text>Scan</Text>
      </Pressable>
      <Pressable
        style={styles.flashButton}
        onPress={() => setFlashState(!flashState)}
      >
        <Text>Flash</Text>
      </Pressable>
    </View>
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
