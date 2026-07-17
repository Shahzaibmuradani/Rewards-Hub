import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

interface RewardsHistoryItemProps {
  gemBalance: number;
}

export function RewardsHistoryItem({ gemBalance }: RewardsHistoryItemProps) {
  const colors = useColors();

  return (
    <View style={[styles.historyCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
      <View style={[styles.historyIcon, { backgroundColor: colors.lightGreen }]}>
        <Text style={{ fontSize: 22 }}>🎁</Text>
      </View>
      <View style={styles.historyContent}>
        <Text style={[styles.historyTitle, { color: colors.foreground }]}>Welcome Rewards</Text>
        <Text style={[styles.historyDate, { color: colors.mutedForeground }]}>22.06.2026</Text>
      </View>
      <Text style={[styles.historyAmount, { color: colors.successGreen }]}>
        +{gemBalance.toLocaleString()} 💎
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  historyCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 14,
  },
  historyIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  historyContent: {
    flex: 1,
    gap: 3,
  },
  historyTitle: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  historyDate: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  historyAmount: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
  },
});
