import { useState } from "react";
import { StyleSheet } from "react-native";
import { Modal, Pressable, Text, TextInput, View } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (value: string) => void;
  label: string;
  secureText?: boolean;
  setValue: (value: string) => void;
  value: string;
};

const UpdateModal = ({
  visible,
  onClose,
  onSave,
  label,
  secureText,
  setValue,
  value,
}: Props) => {
  //   const [input, setInput] = useState("");

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={setValue}
            secureTextEntry={secureText}
            autoCapitalize="none"
          />
          <View style={styles.buttonRow}>
            <Pressable style={styles.button} onPress={onClose}>
              <Text>Cancel</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => {
                onSave(value);
                setValue("");
                onClose();
              }}
            >
              <Text>Save</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default UpdateModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: 300,
    alignItems: "center",
  },
  label: {
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    width: "100%",
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    alignItems: "center",
    padding: 10,
  },
});
