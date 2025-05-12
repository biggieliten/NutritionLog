import { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Log } from "../types/types";

const LogCard = (log: Log) => {
  const orderedKeys: (keyof Log)[] = [
    "calories",
    "protein",
    "carbohydrates",
    "fat",
    "sugar",
    "fiber",
  ];

  //   return (
  //     <View style={styles.container}>
  //       <Text style={styles.text}>{log.date}</Text>
  //       {orderedKeys.map((key) => {
  //         if (key in log) {
  //           return (
  //             <View key={key}>
  //               <Text style={styles.text}>
  //                 {key.charAt(0).toUpperCase() + key.slice(1)}:{" "}
  //                 {Math.round(log[key] as number)}
  //               </Text>
  //             </View>
  //           );
  //         }
  //         return null;
  //       })}
  //     </View>
  //   );
  // };
  // const styles = StyleSheet.create({
  //   container: {
  //     padding: 20,
  //     margin: 10,

  //     height: "auto",
  //     width: "85%",
  //     borderBottomColor: "grey",
  //     borderTopColor: "grey",
  //     borderTopWidth: 0.5,
  //     borderBottomWidth: 0.5,
  //     // backgroundColor: "#91AC8F",
  //     // borderRadius: 15,

  //     shadowColor: "#000",
  //     shadowOffset: { width: 0, height: 2 },
  //     // shadowOpacity: 0.5,
  //     // shadowRadius: 3.84,
  //     // elevation: 2,
  //   },
  //   text: {
  //     fontSize: 20,
  //     fontWeight: "bold",
  //     color: "grey",
  //   },
  // });

  return (
    <View style={styles.container}>
      <View style={styles.accentBar} />
      <Text style={styles.date}>{log.date}</Text>
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
    marginHorizontal: 0,
    // padding: 15,
    width: "100%",
    shadowColor: "#91AC8F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    position: "relative",
  },
  accentBar: {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    width: 10,
    backgroundColor: "#D4AA7D",
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  date: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#D4AA7D",
    marginBottom: 5,
    marginLeft: 10,
  },
  macrosRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginLeft: 10,
    marginRight: 10,
  },
  macroBox: {
    width: "47%",
    marginBottom: 8,
    backgroundColor: "#5D7073",
    borderRadius: 8,
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
