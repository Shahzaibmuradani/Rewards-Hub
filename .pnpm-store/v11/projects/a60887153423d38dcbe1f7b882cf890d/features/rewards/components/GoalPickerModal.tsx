import * as Haptics from "expo-haptics";
import React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import type { ICatalogReward } from "@/types";

interface GoalPickerModalProps {
  visible: boolean;
  rewards: ICatalogReward[];
  currentCatalogId?: string;
  onSelect: (catalogId: string) => void;
  onClose: () => void;
}

export function GoalPickerModal({
  visible,
  rewards,
  currentCatalogId,
  onSelect,
  onClose,
}: GoalPickerModalProps) {
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
          <ScrollView contentContainerStyle={styles.modalList} showsVerticalScrollIndicator={false}>
            {rewards.map((reward) => {
              const isActive = reward.id === currentCatalogId;
              return (
                <TouchableOpacity
                  key={reward.id}
                  onPress={() => {
                    Haptics.selectionAsync();
                    onSelect(reward.id);
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
                  <Text style={styles.modalItemEmoji}>{reward.emoji}</Text>
                  <View style={styles.modalItemInfo}>
                    <Text style={[styles.modalItemTitle, { color: colors.foreground }]}>
                      {reward.label}
                    </Text>
                    <Text style={[styles.modalItemValue, { color: colors.mutedForeground }]}>
                      {reward.gem_cost.toLocaleString()} 💎
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
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end" },
  modalSheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    padding: 20,
    gap: 16,
    maxHeight: "80%",
  },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: "center", marginBottom: 4 },
  modalTitle: { fontSize: 20, fontFamily: "Inter_700Bold" },
  modalList: { gap: 10, paddingBottom: 16 },
  modalItem: { flexDirection: "row", alignItems: "center", padding: 16, borderRadius: 16, gap: 14 },
  modalItemEmoji: { fontSize: 28 },
  modalItemInfo: { flex: 1, gap: 3 },
  modalItemTitle: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  modalItemValue: { fontSize: 13, fontFamily: "Inter_400Regular" },
  activePill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 100 },
  activePillText: { fontSize: 12, fontFamily: "Inter_700Bold", color: "#000" },
});
