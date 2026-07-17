import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

interface ScreenHeaderProps {
  title: string;
}

export function ScreenHeader({ title }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { gemBalance } = useApp();

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: topPad + 12,
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
      <View style={[styles.gemBadge, { backgroundColor: colors.foreground }]}>
        <Text style={[styles.gemText, { color: colors.background }]}>
          {gemBalance.toLocaleString()} 💎
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  gemBadge: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 100,
  },
  gemText: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
  },
});
