import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

interface MenuRowProps {
  label: string;
  value: string;
}

export function MenuRow({ label, value }: MenuRowProps) {
  const colors = useColors();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.menuRow,
        {
          borderBottomColor: colors.border,
          backgroundColor: pressed ? colors.secondary : colors.background,
        },
      ]}
    >
      <View style={styles.menuRowLeft}>
        <Text style={[styles.menuLabel, { color: colors.foreground }]}>{label}</Text>
        {!!value && (
          <Text style={[styles.menuValue, { color: colors.mutedForeground }]} numberOfLines={1}>
            {value}
          </Text>
        )}
      </View>
      <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
    gap: 8,
  },
  menuRowLeft: { flex: 1, gap: 2 },
  menuLabel: { fontSize: 15, fontFamily: "Inter_500Medium" },
  menuValue: { fontSize: 12, fontFamily: "Inter_400Regular" },
});
