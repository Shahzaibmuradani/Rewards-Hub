import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenHeader } from "@/components/ScreenHeader";
import { useColors } from "@/hooks/useColors";

import { GameCard } from "../components/GameCard";
import { GoalCard } from "../components/GoalCard";
import { GoalPickerModal } from "../components/GoalPickerModal";
import { useRewardsScreen } from "../hooks/useRewardsScreen";
import { useSelectGoal } from "../hooks/useRewardsQueries";

export default function RewardsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [pickerVisible, setPickerVisible] = useState(false);

  const { data, error, isLoading, isRefreshing, refreshAll } = useRewardsScreen();
  const selectGoalMutation = useSelectGoal();

  const { activeGoal, fastestPath, catalogRewards } = data;

  const handleSelectGoal = (catalogId: string) => {
    selectGoalMutation.mutate(catalogId);
  };

  if (isLoading && !isRefreshing) {
    return (
      <View style={[styles.root, styles.center, { backgroundColor: colors.card }]}>
        <ActivityIndicator size="large" color={colors.foreground} />
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.card }]}>
      <ScreenHeader title="Rewards" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 90 }]}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
              void refreshAll();
            }}
            tintColor={colors.foreground}
          />
        }
      >
        {error ? (
          <View style={[styles.errorCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={[styles.errorTitle, { color: colors.foreground }]}>Could not load rewards</Text>
            <Text style={[styles.errorBody, { color: colors.mutedForeground }]}>
              Check `EXPO_PUBLIC_API_URL` and make sure your phone can reach the backend host.
            </Text>
          </View>
        ) : null}

        <GoalCard goal={activeGoal} onChangeGoal={() => setPickerVisible(true)} />

        <Text style={[styles.sectionHeader, { color: colors.foreground }]}>
          🚀 Fastest Path to Your Goal
        </Text>

        <FlatList
          data={fastestPath}
          keyExtractor={(game) => game.game_id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carousel}
          renderItem={({ item, index }) => <GameCard game={item} index={index} />}
        />
      </ScrollView>

      <GoalPickerModal
        visible={pickerVisible}
        rewards={catalogRewards}
        currentCatalogId={activeGoal?.catalog_id}
        onSelect={handleSelectGoal}
        onClose={() => setPickerVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: { justifyContent: "center", alignItems: "center" },
  scroll: { padding: 16, gap: 20 },
  sectionHeader: { fontSize: 17, fontFamily: "Inter_700Bold" },
  carousel: { gap: 12, paddingRight: 4 },
  errorCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 6,
  },
  errorTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  errorBody: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 18 },
});
