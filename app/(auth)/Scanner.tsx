import { View, Text, StyleSheet, Pressable } from "react-native";
import { Camera, CameraView } from "expo-camera";
import { useCallback, useContext, useEffect, useState } from "react";
import { BarcodeScanningResult } from "expo-camera";
import { ScanResult } from "../types/types";
import { useGet } from "../hooks/useGet";
import { router, useFocusEffect } from "expo-router";
// import { useScannedProductStore } from "../store/useScannedProductsStore";
import { useAuth } from "../state/AuthState/AuthContext";
import { Ionicons } from "@expo/vector-icons";
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
  const [upcScanned, setUpcScanned] = useState<boolean>(false);
  const [barcode, setBarcode] = useState<string>("");
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(
    null
  );
  const url = `https://world.openfoodfacts.org/api/v0/product/${
    barcode || null
  }.json`;
  const { setScannedProduct } = useAuth();
  const { data } = useGet<ScanResult>(url);

  // Resets states when mounting the route
  useFocusEffect(
    useCallback(() => {
      // This will run every time the screen comes into focus
      setUpcScanned(false);
      setBarcode("");

      return () => {};
    }, [])
  );

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(status === "granted");
    })();
  }, []);

  const handleBarcodeScan = (result: BarcodeScanningResult) => {
    if (result?.data && !upcScanned) {
      //   setScannedProduct(data);
      setUpcScanned(true);

      const productData = result.data;

      setBarcode(productData);

      //   setBarcode(product.data);
      console.log("scanned product!!!!!", productData);
    }
  };
  console.log(barcode);

  //Setting the global state for fetched product data on scan
  useEffect(() => {
    if (barcode) {
      if (data) {
        setScannedProduct(data);
        console.log(`data set:${data}`);
        router.replace("/Menu");
      } else {
        alert("No product found for this barcode");
        setUpcScanned(false);
      }
    }
  }, [data]);

  if (cameraPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }

  if (cameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          barcodeScannerSettings={{
            barcodeTypes: ["upc_a", "upc_e", "ean13", "ean8"],
          }}
          enableTorch={flashState}
          onBarcodeScanned={upcScanned ? undefined : handleBarcodeScan}
        />

        {/* Scanning overlay */}
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
      </View>

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

        <Pressable style={styles.button} onPress={() => setUpcScanned(false)}>
          <Ionicons name="scan-outline" size={24} color="white" />
          <Text style={styles.buttonText}>
            {upcScanned ? "Scan Again" : "Scanning..."}
          </Text>
        </Pressable>
      </View>
    </View>
  );

  //   return (
  //     <View style={styles.container}>
  //       <CameraView
  //         style={styles.camera}
  //         barcodeScannerSettings={{ barcodeTypes: ["upc_a", "upc_e", "ean13"] }}
  //         enableTorch={flashState}
  //         onBarcodeScanned={(barcode) =>
  //           handleBarcodeScan(barcode as BarcodeScanningResult)
  //         }
  //       />
  //       <Pressable
  //         // style={styles.scanButton}
  //         onPress={() => {
  //           setBarcode(barcode);
  //           console.log("barcode:", barcode);
  //           // ,console.log(
  //           //   `barcode set:${barcode}, scannedPc${scannedProduct.code}`
  //           // );
  //         }}
  //       >
  //         <Text>Set barcode</Text>
  //       </Pressable>
  //       {/* <Pressable
  //         // style={styles.scanButton}
  //         onPress={() => {
  //           setBarcode("3017620422003");
  //         }}
  //       >
  //         <Text>Set barcode 2</Text>
  //       </Pressable> */}
  //       <Pressable style={styles.scanButton} onPress={() => setUpcScanned(false)}>
  //         <Text>Scan</Text>
  //       </Pressable>
  //       <Pressable
  //         style={styles.flashButton}
  //         onPress={() => setFlashState(!flashState)}
  //       >
  //         <Text>Flash</Text>
  //       </Pressable>
  //     </View>
  //   );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//   },
//   camera: {
//     flex: 1,
//   },
//   flashButton: {
//     position: "absolute",
//     bottom: 30,
//     marginLeft: 20,
//     backgroundColor: "white",
//     padding: 10,
//     borderRadius: 5,
//   },
//   scanButton: {
//     position: "absolute",
//     bottom: 30,
//     marginLeft: 80,
//     backgroundColor: "white",
//     padding: 10,
//     borderRadius: 5,
//   },
// });
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2D3E40",
  },
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
