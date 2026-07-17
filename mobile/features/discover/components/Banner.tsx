import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

interface BannerProps {
  text: string;
  buttonLabel: string;
  showCoins?: boolean;
}

export function Banner({ text, buttonLabel, showCoins }: BannerProps) {
  const colors = useColors();

  return (
    <View style={[styles.banner, { backgroundColor: colors.yellow }]}>
      <View style={styles.bannerContent}>
        <Text style={[styles.bannerText, { color: colors.foreground }]}>{text}</Text>
        <Pressable style={[styles.bannerBtn, { backgroundColor: colors.foreground }]}>
          <Text style={[styles.bannerBtnText, { color: colors.background }]}>{buttonLabel}</Text>
        </Pressable>
      </View>
      {showCoins && (
        <View style={styles.coinsIcon}>
          <Text style={{ fontSize: 28 }}>🪙</Text>
          <Text style={{ fontSize: 22, marginTop: -8 }}>🪙</Text>
          <Text style={{ fontSize: 16, marginTop: -6 }}>🪙</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  bannerContent: { flex: 1, gap: 12 },
  bannerText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    lineHeight: 21,
    maxWidth: "85%" as never,
  },
  bannerBtn: {
    alignSelf: "flex-start",
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 100,
  },
  bannerBtnText: { fontSize: 14, fontFamily: "Inter_700Bold" },
  coinsIcon: { alignItems: "center", paddingLeft: 8, marginTop: -4 },
});
