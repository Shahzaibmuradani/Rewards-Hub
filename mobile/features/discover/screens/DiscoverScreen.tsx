import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenHeader } from "@/components/ScreenHeader";
import { useColors } from "@/hooks/useColors";

import { Banner } from "../components/Banner";
import { ExtraRewardCard } from "../components/ExtraRewardCard";
import { FeaturedGameCard } from "../components/FeaturedGameCard";

export default function DiscoverScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Discover" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 90 }]}
      >
        <Banner text="Grant us permissions and we'll offer more tasks and perks" buttonLabel="Allow" />
        <Banner text="Grab 100 gems daily!" buttonLabel="Claim" showCoins />

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Extra Rewards</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.extraScroll}
        >
          <ExtraRewardCard
            bg={colors.lightYellow}
            title="Daily Streak"
            subtitle="Get up to 16,216 gems"
            btnLabel="Explore"
          />
          <ExtraRewardCard
            bg={colors.secondary}
            title="2x Boost"
            subtitle="Insufficient gems"
            btnLabel="💎 Earn 3999"
            btnDisabled
          />
          <ExtraRewardCard
            bg={colors.lightPink}
            title="Invite a Friend"
            subtitle="And get 200 coins"
            btnLabel="Get 200"
          />
        </ScrollView>

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Featured Game</Text>
        <FeaturedGameCard />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { padding: 16, gap: 12 },
  sectionTitle: {
    fontSize: 19,
    fontFamily: "Inter_700Bold",
    marginTop: 8,
    marginBottom: 4,
  },
  extraScroll: { gap: 12, paddingRight: 4 },
});
