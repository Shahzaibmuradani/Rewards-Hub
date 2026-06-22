import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Reward, useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const GAMES = [
  { id: "1", name: "Pixel Flow", category: "Arcade", rank: 1, rate: "≈820 💎/hr", isNew: true },
  { id: "2", name: "Stack Blitz", category: "Puzzle", rank: 2, rate: "≈610 💎/hr", isNew: false },
  { id: "3", name: "Coin Rush", category: "Runner", rank: 3, rate: "≈490 💎/hr", isNew: true },
];

const GAME_COLORS = ["#1a1a2e", "#0f3460", "#16213e"];

function GoalCard({
  goal,
  gemBalance,
  onChangeGoal,
}: {
  goal: Reward;
  gemBalance: number;
  onChangeGoal: () => void;
}) {
  const colors = useColors();
  const progress = Math.min(gemBalance / goal.costGems, 1);
  const progressPct = (progress * 100).toFixed(1);
  const remaining = Math.max(goal.costGems - gemBalance, 0);
  const isAchieved = progress >= 1;

  const pulseAnim = useRef(new Animated.Value(1)).current;
  React.useEffect(() => {
    if (isAchieved) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.04, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [isAchieved]);

  return (
    <View
      style={[
        styles.goalCard,
        {
          backgroundColor: colors.background,
          borderColor: colors.border,
          shadowColor: "#000",
        },
      ]}
    >
      <View style={styles.goalHeaderRow}>
        <View style={styles.goalTitleGroup}>
          <Text style={styles.goalEmoji}>💰</Text>
          <Text style={[styles.goalTitle, { color: colors.foreground }]}>
            {goal.value} {goal.brand}
          </Text>
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
            {gemBalance.toLocaleString()}
          </Text>
          <Text style={[styles.progressLabelNum, { color: colors.mutedForeground }]}>
            {goal.costGems.toLocaleString()}
          </Text>
        </View>
      </View>

      <View style={[styles.statsRow, { borderColor: colors.border }]}>
        <View style={[styles.statPill, { backgroundColor: colors.lightYellow }]}>
          <Text style={[styles.statPillText, { color: colors.foreground }]}>{progressPct}%</Text>
        </View>
        <View style={styles.statCenter}>
          <Text style={[styles.statBold, { color: colors.foreground }]}>2.4 days</Text>
          <Text style={[styles.statSub, { color: colors.mutedForeground }]}>estimated</Text>
        </View>
        <View style={styles.statRight}>
          <Text style={[styles.statBold, { color: colors.foreground }]}>
            {remaining.toLocaleString()}
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
              borderWidth: isAchieved ? 0 : 0,
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

function GameCard({ game }: { game: (typeof GAMES)[0] }) {
  const colors = useColors();
  const [loading, setLoading] = useState(false);
  const idx = GAMES.findIndex((g) => g.id === game.id);
  const cardColor = GAME_COLORS[idx % GAME_COLORS.length];

  function handlePlay() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    setTimeout(() => setLoading(false), 1800);
  }

  return (
    <View style={[styles.gameCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
      <View style={[styles.gameGraphic, { backgroundColor: cardColor }]}>
        <View style={styles.badgeRow}>
          <View style={styles.rankBadge}>
            <Text style={styles.rankBadgeText}>Rank #{game.rank}</Text>
          </View>
          {game.isNew && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>NEW</Text>
            </View>
          )}
        </View>
        <View style={styles.graphicCenter}>
          <Text style={{ fontSize: 42 }}>
            {idx === 0 ? "🌊" : idx === 1 ? "🧱" : "🪙"}
          </Text>
        </View>
        <View style={styles.ratePill}>
          <Text style={styles.ratePillText}>{game.rate}</Text>
        </View>
      </View>
      <View style={styles.gameDetails}>
        <View>
          <Text style={[styles.gameName, { color: colors.foreground }]}>{game.name}</Text>
          <Text style={[styles.gameCategory, { color: colors.mutedForeground }]}>{game.category}</Text>
        </View>
        <Pressable
          onPress={handlePlay}
          style={({ pressed }) => [
            styles.playBtn,
            { backgroundColor: colors.foreground, opacity: pressed ? 0.8 : 1 },
          ]}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={[styles.playBtnText, { color: colors.background }]}>Play Now</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

function GoalPickerModal({
  visible,
  rewards,
  currentId,
  onSelect,
  onClose,
}: {
  visible: boolean;
  rewards: Reward[];
  currentId: string;
  onSelect: (r: Reward) => void;
  onClose: () => void;
}) {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} animationType="slide" transparent presentationStyle="overFullScreen">
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable
          style={[
            styles.modalSheet,
            {
              backgroundColor: colors.background,
              paddingBottom: insets.bottom + 16,
              borderTopColor: colors.border,
            },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />
          <Text style={[styles.modalTitle, { color: colors.foreground }]}>Choose a Goal</Text>
          <View style={styles.modalList}>
            {rewards.map((r) => {
              const isActive = r.id === currentId;
              return (
                <TouchableOpacity
                  key={r.id}
                  onPress={() => {
                    Haptics.selectionAsync();
                    onSelect(r);
                    onClose();
                  }}
                  style={[
                    styles.modalItem,
                    {
                      backgroundColor: isActive ? colors.lightYellow : colors.card,
                      borderColor: isActive ? colors.yellow : colors.border,
                      borderWidth: isActive ? 2 : 1,
                    },
                  ]}
                >
                  <Text style={styles.modalItemEmoji}>
                    {r.type === "paypal" ? "💸" : r.type === "amazon" ? "📦" : "🎮"}
                  </Text>
                  <View style={styles.modalItemInfo}>
                    <Text style={[styles.modalItemTitle, { color: colors.foreground }]}>
                      {r.brand}
                    </Text>
                    <Text style={[styles.modalItemValue, { color: colors.mutedForeground }]}>
                      {r.value} · {r.costGems.toLocaleString()} 💎
                    </Text>
                  </View>
                  {isActive && (
                    <View style={[styles.activePill, { backgroundColor: colors.yellow }]}>
                      <Text style={styles.activePillText}>Active</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default function RewardsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  const { gemBalance, rewards } = useApp();
  const [activeGoalId, setActiveGoalId] = useState("1");
  const [pickerVisible, setPickerVisible] = useState(false);

  const activeGoal = rewards.find((r) => r.id === activeGoalId) ?? rewards[0];

  return (
    <View style={[styles.root, { backgroundColor: colors.card }]}>
      <ScreenHeader title="Rewards" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 90 }]}
      >
        <GoalCard
          goal={activeGoal}
          gemBalance={gemBalance}
          onChangeGoal={() => setPickerVisible(true)}
        />

        <Text style={[styles.sectionHeader, { color: colors.foreground }]}>
          🚀 Fastest Path to Your Goal
        </Text>

        <FlatList
          data={GAMES}
          keyExtractor={(g) => g.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carousel}
          renderItem={({ item }) => <GameCard game={item} />}
          scrollEventThrottle={16}
        />
      </ScrollView>

      <GoalPickerModal
        visible={pickerVisible}
        rewards={rewards}
        currentId={activeGoalId}
        onSelect={(r) => setActiveGoalId(r.id)}
        onClose={() => setPickerVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { padding: 16, gap: 20 },

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
  goalHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  goalTitleGroup: { flexDirection: "row", alignItems: "center", gap: 8 },
  goalEmoji: { fontSize: 24 },
  goalTitle: { fontSize: 20, fontFamily: "Inter_700Bold" },
  changeGoalBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 100,
  },
  changeGoalText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },

  progressWrapper: { gap: 6 },
  progressTrack: {
    height: 12,
    borderRadius: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 6,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressLabelNum: { fontSize: 12, fontFamily: "Inter_500Medium" },

  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
  },
  statPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 100,
  },
  statPillText: { fontSize: 16, fontFamily: "Inter_700Bold" },
  statCenter: { alignItems: "center", gap: 2 },
  statRight: { alignItems: "flex-end", gap: 2 },
  statBold: { fontSize: 15, fontFamily: "Inter_700Bold" },
  statSub: { fontSize: 11, fontFamily: "Inter_400Regular" },

  redeemBtn: {
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: "center",
  },
  redeemBtnText: { fontSize: 16, fontFamily: "Inter_700Bold" },

  sectionHeader: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
  },

  carousel: { gap: 12, paddingRight: 4 },

  gameCard: {
    width: 185,
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
  },
  gameGraphic: {
    height: 145,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeRow: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rankBadge: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rankBadgeText: { color: "#fff", fontSize: 11, fontFamily: "Inter_700Bold" },
  newBadge: {
    backgroundColor: "#22C55E",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  newBadgeText: { color: "#fff", fontSize: 11, fontFamily: "Inter_700Bold" },
  graphicCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
  ratePill: {
    position: "absolute",
    bottom: 10,
    backgroundColor: "#FFD147",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 100,
  },
  ratePillText: { color: "#000", fontSize: 12, fontFamily: "Inter_700Bold" },
  gameDetails: {
    padding: 12,
    gap: 10,
  },
  gameName: { fontSize: 15, fontFamily: "Inter_700Bold" },
  gameCategory: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  playBtn: {
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    minHeight: 36,
    justifyContent: "center",
  },
  playBtnText: { fontSize: 13, fontFamily: "Inter_700Bold" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    padding: 20,
    gap: 16,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 4,
  },
  modalTitle: { fontSize: 20, fontFamily: "Inter_700Bold" },
  modalList: { gap: 10 },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    gap: 14,
  },
  modalItemEmoji: { fontSize: 28 },
  modalItemInfo: { flex: 1, gap: 3 },
  modalItemTitle: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  modalItemValue: { fontSize: 13, fontFamily: "Inter_400Regular" },
  activePill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
  },
  activePillText: { fontSize: 12, fontFamily: "Inter_700Bold", color: "#000" },
});
