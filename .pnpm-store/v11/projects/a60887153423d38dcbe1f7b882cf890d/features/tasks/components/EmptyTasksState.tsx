import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

export function EmptyTasksState() {
  const colors = useColors();

  return (
    <View style={styles.emptyContainer}>
      <Image
        source={require("../../../assets/images/empty-tasks.png")}
        style={styles.illustration}
        resizeMode="contain"
      />
      <Text style={[styles.headline, { color: colors.foreground }]}>
        Start playing to see your tasks and progress here
      </Text>
      <Pressable
        style={({ pressed }) => [
          styles.ctaBtn,
          { backgroundColor: colors.yellow, opacity: pressed ? 0.85 : 1 },
        ]}
      >
        <Text style={[styles.ctaBtnText, { color: colors.foreground }]}>Explore Tasks</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 20,
  },
  illustration: {
    width: 200,
    height: 200,
  },
  headline: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
    lineHeight: 28,
  },
  ctaBtn: {
    width: "100%",
    paddingVertical: 18,
    borderRadius: 100,
    alignItems: "center",
  },
  ctaBtnText: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
});
