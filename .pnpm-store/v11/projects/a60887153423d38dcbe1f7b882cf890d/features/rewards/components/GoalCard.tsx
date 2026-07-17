import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";
import type { IActiveGoal } from "@/types";

interface GoalCardProps {
  goal: IActiveGoal | null;
  onChangeGoal: () => void;
}

export function GoalCard({ goal, onChangeGoal }: GoalCardProps) {
  const colors = useColors();
  if (!goal) return null;

  const progress = Math.min(goal.current_gems / goal.target_gems, 1);
  const progressPct = goal.progress_pct.toFixed(1);
  const isAchieved = progress >= 1;

  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!isAchieved) return;

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.04, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [isAchieved, pulseAnim]);

  return (
    <View style={[styles.goalCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
      <View style={styles.goalHeaderRow}>
        <View style={styles.goalTitleGroup}>
          <Text style={styles.goalEmoji}>{goal.emoji || "💰"}</Text>
          <Text style={[styles.goalTitle, { color: colors.foreground }]}>{goal.reward_label}</Text>
        </View>
        <Pressable
          onPress={onChangeGoal}
          style={({ pressed }) => [
            styles.changeGoalBtn,
            { backgroundColor: colors.foreground, opacity: pressed ? 0.75 : 1 },
          ]}
        >
          <Text style={[styles.changeGoalText, { color: colors.background }]}>Change Goal</Text>
        </Pressable>
      </View>

      <View style={styles.progressWrapper}>
        <View style={[styles.progressTrack, { backgroundColor: colors.secondary }]}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.round(progress * 100)}%` as never,
                backgroundColor: isAchieved ? colors.successGreen : colors.yellow,
              },
            ]}
          />
        </View>
        <View style={styles.progressLabels}>
          <Text style={[styles.progressLabelNum, { color: colors.mutedForeground }]}>
            {goal.current_gems.toLocaleString()}
          </Text>
          <Text style={[styles.progressLabelNum, { color: colors.mutedForeground }]}>
            {goal.target_gems.toLocaleString()}
          </Text>
        </View>
      </View>

      <View style={[styles.statsRow, { borderColor: colors.border }]}>
        <View style={[styles.statPill, { backgroundColor: colors.lightYellow }]}>
          <Text style={[styles.statPillText, { color: colors.foreground }]}>{progressPct}%</Text>
        </View>
        <View style={styles.statCenter}>
          <Text style={[styles.statBold, { color: colors.foreground }]}>
            {goal.estimated_days.toFixed(1)} days
          </Text>
          <Text style={[styles.statSub, { color: colors.mutedForeground }]}>estimated</Text>
        </View>
        <View style={styles.statRight}>
          <Text style={[styles.statBold, { color: colors.foreground }]}>
            {goal.gems_remaining.toLocaleString()}
          </Text>
          <Text style={[styles.statSub, { color: colors.mutedForeground }]}>remaining</Text>
        </View>
      </View>

      <Animated.View style={{ transform: [{ scale: isAchieved ? pulseAnim : 1 }] }}>
        <Pressable
          style={({ pressed }) => [
            styles.redeemBtn,
            {
              backgroundColor: isAchieved ? colors.successGreen : colors.foreground,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Text style={[styles.redeemBtnText, { color: "#FFFFFF" }]}>
            {isAchieved ? "🎉 Redeem Now" : "Redeem Now"}
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  goalCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
    gap: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 4,
  },
  goalHeaderRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  goalTitleGroup: { flexDirection: "row", alignItems: "center", gap: 8 },
  goalEmoji: { fontSize: 24 },
  goalTitle: { fontSize: 20, fontFamily: "Inter_700Bold" },
  changeGoalBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 100 },
  changeGoalText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  progressWrapper: { gap: 6 },
  progressTrack: { height: 12, borderRadius: 6, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 6 },
  progressLabels: { flexDirection: "row", justifyContent: "space-between" },
  progressLabelNum: { fontSize: 12, fontFamily: "Inter_500Medium" },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
  },
  statPill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 100 },
  statPillText: { fontSize: 16, fontFamily: "Inter_700Bold" },
  statCenter: { alignItems: "center", gap: 2 },
  statRight: { alignItems: "flex-end", gap: 2 },
  statBold: { fontSize: 15, fontFamily: "Inter_700Bold" },
  statSub: { fontSize: 11, fontFamily: "Inter_400Regular" },
  redeemBtn: { paddingVertical: 16, borderRadius: 100, alignItems: "center" },
  redeemBtnText: { fontSize: 16, fontFamily: "Inter_700Bold" },
});
