import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

interface ExtraRewardCardProps {
  bg: string;
  title: string;
  subtitle: string;
  btnLabel: string;
  btnDisabled?: boolean;
}

export function ExtraRewardCard({
  bg,
  title,
  subtitle,
  btnLabel,
  btnDisabled,
}: ExtraRewardCardProps) {
  const colors = useColors();

  return (
    <View style={[styles.extraCard, { backgroundColor: bg }]}>
      <Text style={[styles.extraCardTitle, { color: colors.foreground }]}>{title}</Text>
      <Text style={[styles.extraCardSub, { color: colors.mutedForeground }]}>{subtitle}</Text>
      <Pressable
        style={[
          styles.extraCardBtn,
          {
            backgroundColor: btnDisabled ? colors.secondary : colors.foreground,
            marginTop: "auto" as never,
          },
        ]}
        disabled={btnDisabled}
      >
        <Text
          style={[
            styles.extraCardBtnText,
            { color: btnDisabled ? colors.mutedForeground : colors.background },
          ]}
        >
          {btnLabel}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  extraCard: {
    width: 160,
    borderRadius: 18,
    padding: 16,
    minHeight: 150,
    gap: 6,
  },
  extraCardTitle: { fontSize: 15, fontFamily: "Inter_700Bold" },
  extraCardSub: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 17 },
  extraCardBtn: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 100,
    alignItems: "center",
  },
  extraCardBtnText: { fontSize: 12, fontFamily: "Inter_700Bold" },
});
