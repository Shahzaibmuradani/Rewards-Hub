import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

interface BalanceCardProps {
  gemBalance: number;
}

export function BalanceCard({ gemBalance }: BalanceCardProps) {
  const colors = useColors();

  return (
    <View style={[styles.balanceCard, { backgroundColor: colors.foreground }]}>
      <Text style={[styles.balanceLabel, { color: "rgba(255,255,255,0.6)" }]}>Balance</Text>
      <Text style={[styles.balanceAmount, { color: "#FFFFFF" }]}>
        {gemBalance.toLocaleString()} 💎
      </Text>
      <Pressable
        style={({ pressed }) => [
          styles.payoutBtn,
          { backgroundColor: colors.yellow, opacity: pressed ? 0.88 : 1 },
        ]}
      >
        <Text style={[styles.payoutBtnText, { color: colors.foreground }]}>Payout now</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  balanceCard: {
    borderRadius: 22,
    padding: 24,
    gap: 10,
  },
  balanceLabel: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  balanceAmount: {
    fontSize: 36,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  payoutBtn: {
    alignSelf: "flex-start",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 100,
    marginTop: 6,
  },
  payoutBtnText: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
  },
});
