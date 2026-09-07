import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Tab = "home" | "surprise" | "map" | "favorites" | "profile";

type Choice = {
  id: string;
  title: string;
  subtitle: string;
};

const moods: Choice[] = [
  { id: "calm", title: "Спокойно", subtitle: "кофе, вода, красивый свет" },
  { id: "romantic", title: "Романтика", subtitle: "закат, ужин, прогулка" },
  { id: "explore", title: "Исследовать", subtitle: "неочевидные места" },
  { id: "fun", title: "Хочу впечатлений", subtitle: "яркий маршрут по городу" },
];

const places = [
  { name: "Новая Голландия", meta: "Прогулка · 45–90 минут", icon: "✦" },
  { name: "Birch", meta: "Ресторан · вечер", icon: "♡" },
  { name: "Музей стрит-арта", meta: "Искусство · 1–1,5 часа", icon: "⌖" },
];

function Header() {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.logo}>alma</Text>
        <Text style={styles.city}>Санкт-Петербург</Text>
      </View>
      <View style={styles.avatar}><Text style={styles.avatarText}>О</Text></View>
    </View>
  );
}

function HomeScreen({ onSurprise }: { onSurprise: () => void }) {
  return (
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <Header />
      <View style={styles.hero}>
        <Text style={styles.kicker}>ТВОЙ ГОРОД · ТВОЁ НАСТРОЕНИЕ</Text>
        <Text style={styles.heroTitle}>Как ты хочешь провести сегодня?</Text>
        <Text style={styles.heroText}>ALMA соберёт день под настроение, компанию, бюджет и время — без переходов в другие приложения.</Text>
        <Pressable style={styles.primaryButton} onPress={onSurprise}>
          <Text style={styles.primaryButtonText}>Удиви меня ✦</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Сегодня тебе может понравиться</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
        {places.map((place) => (
          <View key={place.name} style={styles.placeCard}>
            <Text style={styles.placeIcon}>{place.icon}</Text>
            <Text style={styles.placeName}>{place.name}</Text>
            <Text style={styles.placeMeta}>{place.meta}</Text>
            <Text style={styles.cardLink}>Открыть →</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.miniCard}>
        <Text style={styles.miniKicker}>ALMA ЗНАЕТ ТЕБЯ ЛУЧШЕ</Text>
        <Text style={styles.miniTitle}>Твой городской архетип</Text>
        <Text style={styles.miniText}>Пройди 3 быстрых вопроса — и ALMA будет точнее подбирать настроение дня.</Text>
      </View>
    </ScrollView>
  );
}

function SurpriseScreen() {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedMood = useMemo(() => moods.find((m) => m.id === selected), [selected]);

  return (
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <Header />
      <Text style={styles.kicker}>УДИВИ МЕНЯ</Text>
      <Text style={styles.screenTitle}>С чего начнём?</Text>
      <Text style={styles.screenText}>Выбери настроение. Следом ALMA спросит компанию, бюджет и длительность.</Text>

      <View style={styles.choiceGrid}>
        {moods.map((mood) => {
          const active = mood.id === selected;
          return (
            <Pressable key={mood.id} onPress={() => setSelected(mood.id)} style={[styles.choiceCard, active && styles.choiceCardActive]}>
              <Text style={[styles.choiceTitle, active && styles.choiceTitleActive]}>{mood.title}</Text>
              <Text style={[styles.choiceSubtitle, active && styles.choiceSubtitleActive]}>{mood.subtitle}</Text>
            </Pressable>
          );
        })}
      </View>

      {selectedMood && (
        <View style={styles.resultCard}>
          <Text style={styles.resultKicker}>ALMA ПОНЯЛА</Text>
          <Text style={styles.resultTitle}>{selectedMood.title}</Text>
          <Text style={styles.resultText}>Дальше соберём маршрут из нескольких точек: впечатление, еда и красивый финал дня.</Text>
          <Pressable style={styles.primaryButton}><Text style={styles.primaryButtonText}>Продолжить →</Text></Pressable>
        </View>
      )}
    </ScrollView>
  );
}

function PlaceholderScreen({ title, text, symbol }: { title: string; text: string; symbol: string }) {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Header />
      <View style={styles.placeholderIcon}><Text style={styles.placeholderSymbol}>{symbol}</Text></View>
      <Text style={styles.screenTitle}>{title}</Text>
      <Text style={styles.screenText}>{text}</Text>
      <View style={styles.placeholderCard}><Text style={styles.placeholderCardText}>Раздел уже заложен в мобильную структуру ALMA. Следующим шагом подключим его к данным сайта и аккаунту.</Text></View>
    </ScrollView>
  );
}

export default function App() {
  const [tab, setTab] = useState<Tab>("home");

  const screen = (() => {
    if (tab === "home") return <HomeScreen onSurprise={() => setTab("surprise")} />;
    if (tab === "surprise") return <SurpriseScreen />;
    if (tab === "map") return <PlaceholderScreen title="Карта ALMA" text="Все точки и маршруты — внутри приложения." symbol="⌖" />;
    if (tab === "favorites") return <PlaceholderScreen title="Избранное" text="Твои сохранённые места и дни будут жить здесь." symbol="♡" />;
    return <PlaceholderScreen title="Профиль" text="Архетип, сохранённые маршруты и настройки аккаунта." symbol="О" />;
  })();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.app}>
        <View style={styles.content}>{screen}</View>
        <View style={styles.tabBar}>
          {([
            ["home", "⌂", "Главная"],
            ["surprise", "✦", "Удиви"],
            ["map", "⌖", "Карта"],
            ["favorites", "♡", "Избранное"],
            ["profile", "○", "Профиль"],
          ] as [Tab, string, string][]).map(([id, icon, label]) => {
            const active = tab === id;
            return (
              <Pressable key={id} onPress={() => setTab(id)} style={styles.tabItem}>
                <Text style={[styles.tabIcon, active && styles.tabActive]}>{icon}</Text>
                <Text style={[styles.tabLabel, active && styles.tabActive]}>{label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F3EEE6" },
  app: { flex: 1, backgroundColor: "#F3EEE6" },
  content: { flex: 1 },
  page: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 120 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 24 },
  logo: { fontSize: 30, fontWeight: "800", letterSpacing: -1.6, color: "#111111" },
  city: { marginTop: 2, fontSize: 11, textTransform: "uppercase", letterSpacing: 1.2, color: "#88847E" },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#111111", alignItems: "center", justifyContent: "center" },
  avatarText: { color: "white", fontWeight: "700" },
  hero: { backgroundColor: "#111111", borderRadius: 32, padding: 24, minHeight: 350, justifyContent: "flex-end" },
  kicker: { fontSize: 11, letterSpacing: 1.8, color: "#8D8982", marginBottom: 10, fontWeight: "600" },
  heroTitle: { fontSize: 40, lineHeight: 42, letterSpacing: -1.7, color: "white", fontWeight: "800" },
  heroText: { marginTop: 16, fontSize: 15, lineHeight: 22, color: "#C9C6C1" },
  primaryButton: { marginTop: 22, alignSelf: "flex-start", backgroundColor: "#F3EEE6", borderRadius: 999, paddingVertical: 14, paddingHorizontal: 20 },
  primaryButtonText: { color: "#111111", fontWeight: "700", fontSize: 14 },
  sectionTitle: { marginTop: 34, marginBottom: 14, fontSize: 24, lineHeight: 28, fontWeight: "800", letterSpacing: -0.8, color: "#111111" },
  horizontalList: { gap: 12, paddingRight: 20 },
  placeCard: { width: 220, minHeight: 180, borderRadius: 26, backgroundColor: "#FFFFFF", padding: 18, justifyContent: "flex-end", borderWidth: 1, borderColor: "#E8E2DA" },
  placeIcon: { position: "absolute", top: 16, left: 18, fontSize: 26, color: "#111111" },
  placeName: { fontSize: 21, fontWeight: "800", color: "#111111" },
  placeMeta: { marginTop: 6, color: "#77726C", fontSize: 13 },
  cardLink: { marginTop: 14, fontSize: 13, fontWeight: "700", color: "#111111" },
  miniCard: { marginTop: 24, backgroundColor: "#DCEBDC", borderRadius: 28, padding: 22 },
  miniKicker: { fontSize: 10, letterSpacing: 1.5, color: "#687168", fontWeight: "700" },
  miniTitle: { marginTop: 8, fontSize: 25, fontWeight: "800", color: "#111111" },
  miniText: { marginTop: 8, fontSize: 14, lineHeight: 21, color: "#5F655F" },
  screenTitle: { fontSize: 42, lineHeight: 44, fontWeight: "800", letterSpacing: -1.5, color: "#111111" },
  screenText: { marginTop: 12, maxWidth: 360, fontSize: 15, lineHeight: 22, color: "#77726C" },
  choiceGrid: { marginTop: 28, gap: 12 },
  choiceCard: { backgroundColor: "white", borderRadius: 24, borderWidth: 1, borderColor: "#E5DED5", padding: 19 },
  choiceCardActive: { backgroundColor: "#111111", borderColor: "#111111" },
  choiceTitle: { fontSize: 19, fontWeight: "800", color: "#111111" },
  choiceTitleActive: { color: "white" },
  choiceSubtitle: { marginTop: 5, color: "#77726C", fontSize: 13 },
  choiceSubtitleActive: { color: "#BDB9B4" },
  resultCard: { marginTop: 24, borderRadius: 28, padding: 22, backgroundColor: "#DCEBDC" },
  resultKicker: { fontSize: 10, letterSpacing: 1.5, color: "#667066", fontWeight: "700" },
  resultTitle: { marginTop: 8, fontSize: 28, fontWeight: "800", color: "#111111" },
  resultText: { marginTop: 8, fontSize: 14, lineHeight: 21, color: "#5F655F" },
  placeholderIcon: { width: 72, height: 72, borderRadius: 36, marginTop: 48, marginBottom: 24, backgroundColor: "#111111", alignItems: "center", justifyContent: "center" },
  placeholderSymbol: { color: "white", fontSize: 28, fontWeight: "700" },
  placeholderCard: { marginTop: 30, borderRadius: 26, padding: 20, backgroundColor: "white", borderWidth: 1, borderColor: "#E5DED5" },
  placeholderCardText: { color: "#6D6964", fontSize: 14, lineHeight: 21 },
  tabBar: { position: "absolute", left: 12, right: 12, bottom: 10, flexDirection: "row", justifyContent: "space-around", backgroundColor: "#111111", borderRadius: 26, paddingTop: 10, paddingBottom: 9, paddingHorizontal: 6 },
  tabItem: { flex: 1, alignItems: "center", justifyContent: "center", gap: 2 },
  tabIcon: { fontSize: 20, color: "#777777" },
  tabLabel: { fontSize: 9, color: "#777777", fontWeight: "600" },
  tabActive: { color: "#FFFFFF" },
});
