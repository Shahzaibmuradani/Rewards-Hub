import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenHeader } from "@/components/ScreenHeader";
import { useColors } from "@/hooks/useColors";

import { InviteBanner } from "../components/InviteBanner";
import { MenuRow } from "../components/MenuRow";

const MENU_ITEMS = [
  { label: "Email", value: "john_doe@mailinator.com" },
  { label: "Help and Info", value: "" },
  { label: "Terms of Use", value: "" },
  { label: "Imprint", value: "" },
  { label: "Privacy", value: "" },
];

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Profile" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 90 }]}
      >
        <InviteBanner />

        <View style={[styles.menuCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
          {MENU_ITEMS.map((item, i) => (
            <MenuRow key={i} label={item.label} value={item.value} />
          ))}
        </View>

        <Pressable style={styles.deleteBtn}>
          <Text style={[styles.deleteText, { color: colors.foreground }]}>Delete account</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { padding: 16, gap: 16 },
  menuCard: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
  },
  deleteBtn: {
    alignItems: "center",
    paddingVertical: 16,
  },
  deleteText: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
  },
});
