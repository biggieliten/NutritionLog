import { useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable, Animated } from "react-native";
import { Log } from "../types/types";
import { Ionicons } from "@expo/vector-icons";

const LogCard = (log: Log) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const orderedKeys: (keyof Log)[] = [
    "calories",
    "protein",
    "carbohydrates",
    "fat",
    "sugar",
    "fiber",
  ];

  const expandLog = () => {
    setIsExpanded(!isExpanded);
    Animated.timing(rotateAnim, {
      toValue: isExpanded ? 0 : 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View style={styles.container}>
      <View style={styles.accentBar} />
      <Text style={styles.date}>{log.date}</Text>
      <Animated.View
        style={{
          position: "absolute",
          right: 10,
          top: 10,
          zIndex: 1,
          transform: [{ rotate }],
        }}
      >
        <Ionicons
          name={"chevron-down"}
          size={24}
          color="#D4AA7D"
          onPress={expandLog}
        />
      </Animated.View>
      {isExpanded && (
        <View style={styles.macrosRow}>
          {orderedKeys.map((key) =>
            key in log ? (
              <View style={styles.macroBox} key={key}>
                <Text style={styles.macroLabel}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Text>
                <Text style={styles.macroValue}>
                  {Math.round(log[key] as number)}
                </Text>
              </View>
            ) : null
          )}
        </View>
      )}
    </View>
  );
};

export default LogCard;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5D7073",
    borderRadius: 16,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
    marginVertical: 10,
    marginHorizontal: "auto",
    // padding: 15,
    width: "90%",
    elevation: 3,
    position: "relative",
  },
  accentBar: {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    width: 12,
    backgroundColor: "#D4AA7D",
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    zIndex: 2,
  },
  date: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#D4AA7D",
    marginVertical: 10,
  },

  macrosRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginLeft: 10,
    marginRight: 10,
  },
  macroBox: {
    width: "50%",
    marginBottom: 8,
    backgroundColor: "#5D7073",
    // borderRadius: 16,
    padding: 8,
    alignItems: "center",
  },
  macroLabel: {
    fontSize: 14,
    color: "#8FA3A6",
    fontWeight: "600",
  },
  macroValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 2,
  },
});
