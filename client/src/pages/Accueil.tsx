import { useState, useCallback, useRef, useEffect } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import logoImage from "@assets/APPLICATION MOBILE-6_1764074860081.png";
import userMarkerIcon from "@assets/Icone acpp _1764076202750.png";
import iconTarifs from "@assets/9_1764076802813.png";
import iconCommandes from "@assets/7_1764076802813.png";
import iconPaiement from "@assets/6_1764076802813.png";
import iconDocuments from "@assets/8_1764076802813.png";
import iconContact from "@assets/10_1764076802814.png";
import type { Order } from "@shared/schema";
import { getCurrentPosition } from "@/lib/geolocation";

const defaultCenter = {
  latitude: -17.5334,
  longitude: -149.5667,
};

const mapStyles = [
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#a3ccff" }, { lightness: 20 }],
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [{ color: "#f5f5f5" }, { lightness: 20 }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.fill",
    stylers: [{ color: "#ffffff" }, { lightness: 17 }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#ffffff" }, { lightness: 29 }, { weight: 0.2 }],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }, { lightness: 18 }],
  },
  {
    featureType: "road.local",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }, { lightness: 16 }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#e8f0e8" }, { lightness: 21 }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#c5e8c5" }, { lightness: 21 }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#f2f2f2" }, { lightness: 19 }],
  },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [{ color: "#fefefe" }, { lightness: 17 }, { weight: 1.2 }],
  },
  {
    featureType: "all",
    elementType: "labels.text.stroke",
    stylers: [{ visibility: "on" }, { color: "#ffffff" }, { lightness: 16 }],
  },
  {
    featureType: "all",
    elementType: "labels.text.fill",
    stylers: [{ saturation: 36 }, { color: "#666666" }, { lightness: 40 }],
  },
  {
    featureType: "all",
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
];

const categories = [
  { id: "tarifs", label: "Tarifs", iconImage: iconTarifs, href: "Tarifs" },
  { id: "commandes", label: "Commandes", iconImage: iconCommandes, href: "Commandes" },
  { id: "paiement", label: "Paiement", iconImage: iconPaiement, href: "Wallet" },
  { id: "documents", label: "Documents", iconImage: iconDocuments, href: "Documents" },
  { id: "contact", label: "Contact", iconImage: iconContact, href: "Contact" },
];

const menuItems = [
  { label: "Mon profil", href: "Profil" },
  { label: "Mes commandes", href: "Commandes" },
  { label: "Mon wallet", href: "Wallet" },
  { label: "Tarifs", href: "Tarifs" },
  { label: "Aide", href: "Aide" },
  { label: "Chauffeur", href: "ChauffeurLogin" },
];

const screenWidth = Dimensions.get("window").width;

function MapComponent() {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(
    null,
  );
  const [permissionAsked, setPermissionAsked] = useState(false);

  const handleLocation = useCallback(() => {
    if (permissionAsked) {
      return;
    }

    setPermissionAsked(true);
    getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
    })
      .then((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
      })
      .catch((error) => {
        console.log("Localisation refusée ou indisponible:", error.message);
        setUserLocation(defaultCenter);
      });
  }, [permissionAsked]);

  useEffect(() => {
    handleLocation();
  }, [handleLocation]);

  const region = {
    latitude: userLocation?.latitude ?? defaultCenter.latitude,
    longitude: userLocation?.longitude ?? defaultCenter.longitude,
    latitudeDelta: userLocation ? 0.02 : 0.05,
    longitudeDelta: userLocation ? 0.02 : 0.05,
  };

  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      region={region}
      customMapStyle={mapStyles}
      showsCompass={false}
      showsMyLocationButton={false}
      toolbarEnabled={false}
    >
      {userLocation && (
        <Marker
          coordinate={userLocation}
          title="Votre position"
          image={userMarkerIcon}
          anchor={{ x: 0.5, y: 1 }}
        />
      )}
    </MapView>
  );
}

export function Accueil() {
  const navigation = useNavigation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const showPubSection = false;

  const { data: activeOrderData } = useQuery<{
    hasActiveOrder: boolean;
    order?: Order;
    clientToken?: string;
  }>({
    queryKey: ["/api/orders/active/client"],
    refetchInterval: 3000,
  });

  useEffect(() => {
    if (activeOrderData?.hasActiveOrder && activeOrderData.order) {
      const order = activeOrderData.order;

      // TODO: Replace with AsyncStorage once available in native build.
      sessionStorage.setItem("currentOrderId", order.id);
      if (activeOrderData.clientToken) {
        sessionStorage.setItem("clientToken", activeOrderData.clientToken);
      }
      const pickup = order.addresses?.find((a) => a.type === "pickup")?.value || "";
      const destination = order.addresses?.find((a) => a.type === "destination")?.value || "";
      sessionStorage.setItem("orderPickup", pickup);
      sessionStorage.setItem("orderDestination", destination);
      sessionStorage.setItem("orderTotal", String(order.totalPrice ?? 0));
      sessionStorage.setItem("orderDistance", String(order.routeInfo?.distance || ""));
      sessionStorage.setItem("orderStatus", order.status || "");
    } else if (activeOrderData && !activeOrderData.hasActiveOrder) {
      console.log("[Accueil] No active order - clearing stale sessionStorage");
      sessionStorage.removeItem("currentOrderId");
      sessionStorage.removeItem("clientToken");
      sessionStorage.removeItem("orderPickup");
      sessionStorage.removeItem("orderDestination");
      sessionStorage.removeItem("orderTotal");
      sessionStorage.removeItem("orderDistance");
      sessionStorage.removeItem("orderStatus");
      sessionStorage.removeItem("clientRideStatus");
    }
  }, [activeOrderData]);

  const handleScroll = (event: { nativeEvent: { contentOffset: { x: number }; contentSize: { width: number }; layoutMeasurement: { width: number } } }) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const maxScroll = contentSize.width - layoutMeasurement.width;
    const progress = maxScroll > 0 ? contentOffset.x / maxScroll : 0;
    setScrollProgress(progress);
  };

  const handleCategoryClick = (category: typeof categories[number]) => {
    setSelectedCategory(category.id);
    navigation.navigate(category.href as never);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.iconButton}
          onPress={() => setMenuOpen(true)}
          testID="button-menu"
        >
          <Text style={styles.iconButtonText}>☰</Text>
        </Pressable>

        <View style={styles.logoContainer}>
          <Image source={logoImage} style={styles.logo} resizeMode="contain" />
        </View>

        <Pressable
          style={[styles.iconButton, styles.supportButton]}
          onPress={() => navigation.navigate("Support" as never)}
          testID="button-support"
        >
          <Text style={styles.supportButtonText}>?</Text>
        </Pressable>
      </View>

      {menuOpen && (
        <View style={styles.menuOverlay}>
          <Pressable style={styles.menuBackdrop} onPress={() => setMenuOpen(false)} />
          <View style={styles.menuPanel}>
            <ScrollView contentContainerStyle={styles.menuItems}>
              {menuItems.map((item) => (
                <Pressable
                  key={item.href}
                  style={styles.menuItem}
                  onPress={() => {
                    setMenuOpen(false);
                    navigation.navigate(item.href as never);
                  }}
                  testID={`menu-item-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <Text style={styles.menuItemText}>{item.label}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      <View style={styles.categoriesWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          ref={scrollRef}
        >
          {categories.map((category) => {
            const isSelected = selectedCategory === category.id;
            return (
              <Pressable
                key={category.id}
                style={[
                  styles.categoryPill,
                  isSelected ? styles.categoryPillSelected : styles.categoryPillDefault,
                ]}
                onPress={() => handleCategoryClick(category)}
                testID={`button-category-${category.id}`}
              >
                <Image source={category.iconImage} style={styles.categoryIcon} resizeMode="contain" />
                <Text
                  style={[
                    styles.categoryText,
                    isSelected ? styles.categoryTextSelected : styles.categoryTextDefault,
                  ]}
                >
                  {category.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
        <View style={styles.scrollTrack}>
          <View
            style={[
              styles.scrollThumb,
              { left: `${scrollProgress * 70}%` },
            ]}
          />
        </View>
      </View>

      <View style={styles.mapContainer}>
        <MapComponent />
      </View>

      <View style={styles.bottomSheet}>
        {showPubSection && (
          <View style={styles.promoCard}>
            <View style={styles.promoContent}>
              <View>
                <Text style={styles.promoTitle}>OÙ VOUS VOULEZ</Text>
                <Text style={styles.promoTitle}>QUAND VOUS VOULEZ</Text>
                <Text style={styles.promoSubtitle}>NEED A DRIVER?</Text>
              </View>
              <View style={styles.storeBadges}>
                <View style={styles.storeBadge}>
                  <Text style={styles.storeBadgeSmall}>GET IT ON</Text>
                  <Text style={styles.storeBadgeLarge}>Google Play</Text>
                </View>
                <View style={styles.storeBadge}>
                  <Text style={styles.storeBadgeSmall}>Download on the</Text>
                  <Text style={styles.storeBadgeLarge}>App Store</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {activeOrderData?.hasActiveOrder &&
          activeOrderData.order &&
          activeOrderData.order.paymentMethod === "card" &&
          (activeOrderData.order.status === "payment_pending" ||
            activeOrderData.order.status === "payment_failed") && (
            <Pressable
              onPress={() => navigation.navigate("CartesBancaires" as never)}
              style={styles.paymentBanner}
              testID="button-payment-issue"
            >
              <View style={styles.paymentIcon}>
                <Text style={styles.paymentIconText}>🚗</Text>
              </View>
              <View style={styles.paymentContent}>
                <Text style={styles.paymentTitle}>Paiement requis</Text>
                <Text style={styles.paymentSubtitle}>
                  {activeOrderData.order.status === "payment_pending" &&
                    "Veuillez finaliser le paiement"}
                  {activeOrderData.order.status === "payment_failed" &&
                    "Le paiement a échoué - réessayez"}
                </Text>
              </View>
              <Text style={styles.paymentArrow}>›</Text>
            </Pressable>
          )}

        <View style={styles.actionRow}>
          <Pressable
            style={styles.searchButton}
            onPress={() => navigation.navigate("Reservation" as never)}
            testID="button-reservation"
          >
            <Text style={styles.searchIcon}>🔍</Text>
            <Text style={styles.searchPlaceholder}>Où allez-vous ?</Text>
          </Pressable>
          <Pressable
            style={styles.mapPickerButton}
            onPress={() => navigation.navigate("MapPicker" as never)}
            testID="button-map-picker"
          >
            <Text style={styles.mapPickerIcon}>🗺️</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    flex: 1,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  iconButton: {
    backgroundColor: "rgba(255, 223, 109, 0.9)",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  iconButtonText: {
    color: "#343434",
    fontSize: 20,
    fontWeight: "600",
  },
  supportButton: {
    backgroundColor: "#ff6b6b",
  },
  supportButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
  },
  logo: {
    width: 160,
    height: 75,
  },
  menuOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 30,
    flexDirection: "row",
  },
  menuBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  menuPanel: {
    width: 300,
    backgroundColor: "#ffffff",
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  menuItems: {
    paddingBottom: 40,
  },
  menuItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  menuItemText: {
    fontSize: 18,
    color: "#3a3a3a",
  },
  categoriesWrapper: {
    position: "absolute",
    top: 90,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  categoriesScroll: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 8,
  },
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryPillSelected: {
    backgroundColor: "rgba(255, 223, 109, 1)",
  },
  categoryPillDefault: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  categoryIcon: {
    width: 24,
    height: 24,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
  },
  categoryTextSelected: {
    color: "#5c5c5c",
  },
  categoryTextDefault: {
    color: "#ffffff",
  },
  scrollTrack: {
    height: 4,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 999,
    marginHorizontal: 48,
    marginTop: 6,
    overflow: "hidden",
  },
  scrollThumb: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "30%",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 999,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    width: screenWidth,
    height: "100%",
  },
  bottomSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  promoCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: "hidden",
  },
  promoContent: {
    backgroundColor: "#1f1f1f",
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  promoTitle: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 12,
  },
  promoSubtitle: {
    color: "#ffdf6d",
    fontWeight: "600",
    fontSize: 10,
    marginTop: 4,
  },
  storeBadges: {
    gap: 4,
  },
  storeBadge: {
    backgroundColor: "#000",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  storeBadgeSmall: {
    color: "#fff",
    fontSize: 8,
  },
  storeBadgeLarge: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  paymentBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff6b6b",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  paymentIcon: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 16,
    padding: 8,
  },
  paymentIconText: {
    fontSize: 18,
  },
  paymentContent: {
    flex: 1,
    marginLeft: 12,
  },
  paymentTitle: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  paymentSubtitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
  },
  paymentArrow: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f6f6f6",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchPlaceholder: {
    color: "#8c8c8c",
    fontSize: 14,
    fontWeight: "500",
  },
  mapPickerButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#ffdf6d",
    alignItems: "center",
    justifyContent: "center",
  },
  mapPickerIcon: {
    fontSize: 18,
  },
});
