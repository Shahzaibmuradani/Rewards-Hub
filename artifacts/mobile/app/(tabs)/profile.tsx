import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useColors } from "@/hooks/useColors";

const MENU_ITEMS = [
  { label: "Email", value: "shahzaib_muradani@outlook.com" },
  { label: "Help and Info", value: "" },
  { label: "Terms of Use", value: "" },
  { label: "Imprint", value: "" },
  { label: "Privacy", value: "" },
];

function MenuRow({ label, value }: { label: string; value: string }) {
  const colors = useColors();
  return (
    <Pressable
      style={({ pressed }) => [
        styles.menuRow,
        {
          borderBottomColor: colors.border,
          backgroundColor: pressed ? colors.secondary : colors.background,
        },
      ]}
    >
      <View style={styles.menuRowLeft}>
        <Text style={[styles.menuLabel, { color: colors.foreground }]}>{label}</Text>
        {!!value && (
          <Text style={[styles.menuValue, { color: colors.mutedForeground }]} numberOfLines={1}>
            {value}
          </Text>
        )}
      </View>
      <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
    </Pressable>
  );
}

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
  menuCard: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
    gap: 8,
  },
  menuRowLeft: { flex: 1, gap: 2 },
  menuLabel: { fontSize: 15, fontFamily: "Inter_500Medium" },
  menuValue: { fontSize: 12, fontFamily: "Inter_400Regular" },
  deleteBtn: {
    alignItems: "center",
    paddingVertical: 16,
  },
  deleteText: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
  },
});
