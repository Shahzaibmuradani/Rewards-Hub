import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

export function FeaturedGameCard() {
  const colors = useColors();

  return (
    <View style={[styles.gameCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.gameBannerContainer}>
        <Image
          source={require("../../../assets/images/pixel-flow-banner.png")}
          style={styles.gameBanner}
          resizeMode="cover"
        />
        <View style={styles.gameTitleOverlay}>
          <Text style={styles.gameTitleText}>Pixel Flow!</Text>
        </View>
      </View>
      <View style={[styles.gameFooter, { backgroundColor: colors.darkCard }]}>
        <View style={styles.gemPill}>
          <Text style={styles.gemPillText}>≈ 204,261 💎</Text>
        </View>
        <View style={styles.gemPill}>
          <Text style={styles.gemPillText}>≈ 53,038 💎</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gameCard: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
  },
  gameBannerContainer: { height: 180, position: "relative" },
  gameBanner: { width: "100%", height: "100%" },
  gameTitleOverlay: {
    position: "absolute",
    bottom: 12,
    left: 14,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  gameTitleText: { color: "#fff", fontSize: 18, fontFamily: "Inter_700Bold" },
  gameFooter: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
    justifyContent: "center",
  },
  gemPill: {
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
  },
  gemPillText: { color: "#fff", fontSize: 13, fontFamily: "Inter_600SemiBold" },
});
