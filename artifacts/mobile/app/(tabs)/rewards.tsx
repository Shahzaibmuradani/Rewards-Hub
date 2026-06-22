import * as Haptics from "expo-haptics";
import React, { useRef } from "react";
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const FIRST_MILESTONE = 3999;

function PayoutCard({ brand, value, costGems }: { brand: string; value: string; costGems: number }) {
  const colors = useColors();
  return (
    <View style={[styles.payoutCard, { backgroundColor: colors.lightGreen }]}>
      <View style={styles.coinFloating}>
        <Text style={{ fontSize: 30 }}>💰</Text>
      </View>
      <Text style={[styles.payoutBrand, { color: colors.foreground }]}>{brand}</Text>
      <Text style={[styles.payoutValue, { color: colors.foreground }]}>{value}</Text>
      <View style={[styles.payoutCostPill, { backgroundColor: "rgba(0,0,0,0.08)" }]}>
        <Text style={[styles.payoutCostText, { color: colors.foreground }]}>
          💎 {costGems.toLocaleString()}
        </Text>
      </View>
    </View>
  );
}

export default function RewardsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  const { gemBalance, rewards, addGems } = useApp();
  const animScale = useRef(new Animated.Value(1)).current;

  const progress = Math.min(gemBalance / FIRST_MILESTONE, 1);
  const isGoalReached = gemBalance >= FIRST_MILESTONE;
  const gemsNeeded = Math.max(FIRST_MILESTONE - gemBalance, 0);

  function handleStartPlaying() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.sequence([
      Animated.timing(animScale, { toValue: 0.96, duration: 80, useNativeDriver: true }),
      Animated.timing(animScale, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
    if (!isGoalReached) {
      addGems(1900);
    }
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Rewards" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.bgScroll, { paddingBottom: 360 + bottomPad }]}
      >
        <Text style={[styles.catalogTitle, { color: colors.foreground }]}>Payouts</Text>
        <View style={styles.payoutGrid}>
          {rewards.map((r) => (
            <PayoutCard key={r.id} brand={r.brand} value={r.value} costGems={r.costGems} />
          ))}
        </View>
      </ScrollView>

      <View
        style={[
          styles.sheet,
          {
            backgroundColor: colors.background,
            paddingBottom: bottomPad + 90,
            borderTopColor: colors.border,
            shadowColor: "#000",
          },
        ]}
      >
        <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />

        <View style={styles.sheetIconRow}>
          <Text style={styles.ticketEmoji}>🎟️</Text>
          <Text style={styles.ticketEmoji}>🎟️</Text>
        </View>

        <Text style={[styles.sheetTitle, { color: colors.foreground }]}>
          Get PayPal payouts, gift cards or coupons from top brands
        </Text>

        {isGoalReached ? (
          <View style={[styles.successBanner, { backgroundColor: colors.lightGreen }]}>
            <Text style={[styles.successText, { color: colors.successGreen }]}>
              🎉 You've reached your goal! Redeem now
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.progressWrapper}>
              <View style={styles.progressLabels}>
                <Text style={[styles.progressLabel, { color: colors.foreground }]}>
                  {gemBalance.toLocaleString()} 💎
                </Text>
                <Text style={[styles.progressLabel, { color: colors.foreground }]}>
                  {FIRST_MILESTONE.toLocaleString()} 💎
                </Text>
              </View>
              <View style={[styles.progressTrack, { backgroundColor: colors.secondary }]}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      backgroundColor: colors.foreground,
                      width: `${Math.round(progress * 100)}%` as never,
                    },
                  ]}
                />
              </View>
            </View>
            <Text style={[styles.progressSubtext, { color: colors.mutedForeground }]}>
              Earn {gemsNeeded.toLocaleString()} gems to unlock your first reward!
            </Text>
          </>
        )}

        <Animated.View style={{ transform: [{ scale: animScale }] }}>
          <Pressable
            onPress={handleStartPlaying}
            style={({ pressed }) => [
              styles.startBtn,
              {
                backgroundColor: isGoalReached ? colors.yellow : colors.foreground,
                opacity: pressed ? 0.88 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.startBtnText,
                { color: isGoalReached ? colors.foreground : colors.background },
              ]}
            >
              {isGoalReached ? "Redeem Now" : "Start Playing"}
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  bgScroll: { padding: 16 },
  catalogTitle: {
    fontSize: 19,
    fontFamily: "Inter_700Bold",
    marginBottom: 12,
  },
  payoutGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  payoutCard: {
    width: "47%",
    borderRadius: 18,
    padding: 16,
    minHeight: 140,
    gap: 6,
    overflow: "hidden",
  },
  coinFloating: {
    position: "absolute",
    top: -8,
    right: -6,
    opacity: 0.5,
    transform: [{ rotate: "15deg" }],
  },
  payoutBrand: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  payoutValue: { fontSize: 22, fontFamily: "Inter_700Bold" },
  payoutCostPill: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
    marginTop: "auto" as never,
  },
  payoutCostText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 12,
    gap: 14,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 4,
  },
  sheetIconRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },
  ticketEmoji: { fontSize: 32 },
  sheetTitle: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
    lineHeight: 23,
  },
  progressWrapper: { gap: 8 },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  progressTrack: {
    height: 14,
    borderRadius: 7,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 7,
  },
  progressSubtext: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  successBanner: {
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
  },
  successText: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
  startBtn: {
    paddingVertical: 18,
    borderRadius: 100,
    alignItems: "center",
  },
  startBtnText: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
});
