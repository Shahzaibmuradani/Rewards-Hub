import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";
import type { IFastestPathItem } from "@/types";

const GAME_COLORS = ["#1a1a2e", "#0f3460", "#16213e"];

interface GameCardProps {
  game: IFastestPathItem;
  index: number;
}

export function GameCard({ game, index }: GameCardProps) {
  const colors = useColors();
  const [loading, setLoading] = useState(false);
  const cardColor = GAME_COLORS[index % GAME_COLORS.length];

  function handlePlay() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    setTimeout(() => setLoading(false), 1800);
  }

  const emoji = game.name.toLowerCase().includes("flow")
    ? "🌊"
    : game.name.toLowerCase().includes("blitz")
      ? "🧱"
      : "🪙";

  return (
    <View style={[styles.gameCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
      <View style={[styles.gameGraphic, { backgroundColor: cardColor }]}>
        <View style={styles.badgeRow}>
          <View style={styles.rankBadge}>
            <Text style={styles.rankBadgeText}>Rank #{game.rank}</Text>
          </View>
          {!game.user_played && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>NEW</Text>
            </View>
          )}
        </View>
        <View style={styles.graphicCenter}>
          <Text style={{ fontSize: 42 }}>{emoji}</Text>
        </View>
        <View style={styles.ratePill}>
          <Text style={styles.ratePillText}>≈{game.estimated_gems_hour} 💎/hr</Text>
        </View>
      </View>
      <View style={styles.gameDetails}>
        <View>
          <Text numberOfLines={1} style={[styles.gameName, { color: colors.foreground }]}>
            {game.name}
          </Text>
          <Text style={[styles.gameCategory, { color: colors.mutedForeground }]}>
            {game.category.charAt(0).toUpperCase() + game.category.slice(1)}
          </Text>
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

const styles = StyleSheet.create({
  gameCard: { width: 185, borderRadius: 18, borderWidth: 1, overflow: "hidden" },
  gameGraphic: { height: 145, position: "relative", alignItems: "center", justifyContent: "center" },
  badgeRow: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rankBadge: { backgroundColor: "#3B82F6", paddingHorizontal: 9, paddingVertical: 4, borderRadius: 8 },
  rankBadgeText: { color: "#fff", fontSize: 11, fontFamily: "Inter_700Bold" },
  newBadge: { backgroundColor: "#22C55E", paddingHorizontal: 9, paddingVertical: 4, borderRadius: 8 },
  newBadgeText: { color: "#fff", fontSize: 11, fontFamily: "Inter_700Bold" },
  graphicCenter: { alignItems: "center", justifyContent: "center" },
  ratePill: {
    position: "absolute",
    bottom: 10,
    backgroundColor: "#FFD147",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 100,
  },
  ratePillText: { color: "#000", fontSize: 12, fontFamily: "Inter_700Bold" },
  gameDetails: { padding: 12, gap: 10 },
  gameName: { fontSize: 15, fontFamily: "Inter_700Bold" },
  gameCategory: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  playBtn: { paddingVertical: 10, borderRadius: 10, alignItems: "center", minHeight: 36, justifyContent: "center" },
  playBtnText: { fontSize: 13, fontFamily: "Inter_700Bold" },
});
