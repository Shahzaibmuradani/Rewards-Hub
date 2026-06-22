import React from "react";
import { Image, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useColors } from "@/hooks/useColors";

export default function TasksScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScreenHeader title="My Tasks" />
      <View style={[styles.body, { paddingBottom: bottomPad + 90 }]}>
        <View style={styles.emptyContainer}>
          <Image
            source={require("../../assets/images/empty-tasks.png")}
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  body: { flex: 1 },
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
