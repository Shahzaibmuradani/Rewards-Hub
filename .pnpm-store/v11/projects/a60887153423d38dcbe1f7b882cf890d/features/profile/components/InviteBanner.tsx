import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

export function InviteBanner() {
  const colors = useColors();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.inviteBanner,
        { backgroundColor: colors.lightPink, opacity: pressed ? 0.9 : 1 },
      ]}
    >
      <Text style={{ fontSize: 36 }}>🪪</Text>
      <View style={styles.inviteContent}>
        <Text style={[styles.inviteTitle, { color: colors.foreground }]}>Invite a Friend</Text>
        <Text style={[styles.inviteSub, { color: colors.mutedForeground }]}>
          Share & earn rewards together
        </Text>
      </View>
      <Feather name="chevron-right" size={22} color={colors.foreground} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  inviteBanner: {
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  inviteContent: { flex: 1, gap: 3 },
  inviteTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  inviteSub: { fontSize: 13, fontFamily: "Inter_400Regular" },
});
