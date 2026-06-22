import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function WalletScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  const { gemBalance } = useApp();

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Wallet" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 90 }]}
      >
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

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Rewards History</Text>

        <View style={styles.dividerRow}>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.mutedForeground }]}>22.06.2026</Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        </View>

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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { padding: 16, gap: 16 },
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
  sectionTitle: {
    fontSize: 19,
    fontFamily: "Inter_700Bold",
    marginTop: 4,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
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
