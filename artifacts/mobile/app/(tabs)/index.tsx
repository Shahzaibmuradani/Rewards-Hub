import React from "react";
import {
  Image,
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

function Banner({
  text,
  buttonLabel,
  showCoins,
}: {
  text: string;
  buttonLabel: string;
  showCoins?: boolean;
}) {
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

function ExtraRewardCard({
  bg,
  title,
  subtitle,
  btnLabel,
  btnDisabled,
}: {
  bg: string;
  title: string;
  subtitle: string;
  btnLabel: string;
  btnDisabled?: boolean;
}) {
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
        <View style={[styles.gameCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.gameBannerContainer}>
            <Image
              source={require("../../assets/images/pixel-flow-banner.png")}
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { padding: 16, gap: 12 },
  banner: {
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  bannerContent: { flex: 1, gap: 12 },
  bannerText: { fontSize: 15, fontFamily: "Inter_600SemiBold", lineHeight: 21, maxWidth: "85%" as never },
  bannerBtn: {
    alignSelf: "flex-start",
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 100,
  },
  bannerBtnText: { fontSize: 14, fontFamily: "Inter_700Bold" },
  coinsIcon: { alignItems: "center", paddingLeft: 8, marginTop: -4 },
  sectionTitle: {
    fontSize: 19,
    fontFamily: "Inter_700Bold",
    marginTop: 8,
    marginBottom: 4,
  },
  extraScroll: { gap: 12, paddingRight: 4 },
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
