import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// ----------------------- HOTELS DATA -----------------------
const HOTELS = [
  {
    id: "1",
    name: "Sultan Gardens Resort",
    location: "Antalya, Türkiye",
    price: "₺10000 / gece",
    image:
      "https://cdn.tatilsepeti.com/Files/Images/Tesis/00279/1050X700/tsr00279638097400011801151.jpg",
  },
  {
    id: "2",
    name: "Blue Waters Club",
    location: "Antalya, Türkiye",
    price: "₺9000 / gece",
    image:
      "https://cdn.tatilsepeti.com/Files/Images/Tesis/00345/1050X700/tsr00345638794432134251122.jpg",
  },
  {
    id: "3",
    name: "Trendy Aspendos Beach",
    location: "Antalya, Türkiye",
    price: "₺2.300 / gece",
    image:
      "https://cdn.tatilsepeti.com/Files/Images/Tesis/01679/450x300/tsr01679638768510228603375.jpg",
  },
  {
    id: "4",
    name: "Calyptus Kirman Premium",
    location: "Antalya, Türkiye",
    price: "₺1.800 / gece",
    image:
      "https://cdn.tatilsepeti.com/Files/Images/Tesis/11421/450x300/tsr11421638489584928442328.jpg",
  },
  {
    id: "5",
    name: "Kapadokya Cave Suites",
    location: "Nevşehir, Türkiye",
    price: "₺2.600 / gece",
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "6",
    name: "Sueno Hotels Deluxe Belek",
    location: "Antalya, Türkiye",
    price: "₺2.100 / gece",
    image:
      "https://cdn.tatilsepeti.com/Files/Images/Tesis/04892/450X300/tsr04892638475811736079370.jpg",
  },
  {
    id: "7",
    name: "Robinson Nobilis",
    location: "Antalya, Türkiye",
    price: "₺1.900 / gece",
    image:
      "https://cdn.tatilsepeti.com/Files/Images/Tesis/01732/450x300/tsr01732638367780022394200.jpg",
  },
  {
    id: "8",
    name: "Susesi Luxury Resort",
    location: "Antalya, Türkiye",
    price: "₺1.700 / gece",
    image:
      "https://cdn.tatilsepeti.com/Files/Images/Tesis/01853/450x300/tsr01853638870713319967616.jpg",
  },
];

// ----------------------- RESERVE FORM -----------------------
function ReserveForm({ visible, onClose, hotel, onSaved }) {
  const [name, setName] = useState("");
  const [people, setPeople] = useState("");
  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(new Date());
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showCheckOut, setShowCheckOut] = useState(false);

  const saveReservation = async () => {
    if (!name || !people) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun!");
      return;
    }

    const newRes = {
      id: Date.now().toString(),
      hotelName: hotel.name,
      hotelImage: hotel.image,
      hotelPrice: hotel.price,
      hotelLocation: hotel.location,
      name,
      people: parseInt(people, 10),
      checkIn: checkIn.toLocaleDateString(),
      checkOut: checkOut.toLocaleDateString(),
    };

    const data = await AsyncStorage.getItem("reservations");
    const arr = data ? JSON.parse(data) : [];
    arr.push(newRes);
    await AsyncStorage.setItem("reservations", JSON.stringify(arr));

    Alert.alert("Başarılı", "Rezervasyonunuz kaydedildi!");
    onSaved?.();
    onClose();
    setName("");
    setPeople("1");
    setCheckIn(new Date());
    setCheckOut(new Date());
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Rezervasyon: {hotel?.name}</Text>
          <Text style={styles.location}>{hotel?.location}</Text>
          <Text style={styles.price}>{hotel?.price}</Text>
          <TextInput
            style={styles.input}
            placeholder="Ad Soyad"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Kişi Sayısı"
            value={people}
            onChangeText={setPeople}
            keyboardType="numeric"
          />

          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowCheckIn(true)}
          >
            <Ionicons name="calendar-outline" size={20} color="#003366" />
            <Text style={styles.dateText}>
              Giriş Tarihi: {checkIn.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          {showCheckIn && (
            <DateTimePicker
              value={checkIn}
              mode="date"
              display="default"
              onChange={(e, d) => {
                setShowCheckIn(false);
                d && setCheckIn(d);
              }}
            />
          )}

          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowCheckOut(true)}
          >
            <Ionicons name="calendar-outline" size={20} color="#003366" />
            <Text style={styles.dateText}>
              Çıkış Tarihi: {checkOut.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          {showCheckOut && (
            <DateTimePicker
              value={checkOut}
              mode="date"
              display="default"
              onChange={(e, d) => {
                setShowCheckOut(false);
                d && setCheckOut(d);
              }}
            />
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={saveReservation}
            >
              <Text style={styles.button1Text}>Kaydet</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.button1Text}>İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ----------------------- HOME SCREEN -----------------------
function HomeScreen({ navigation }) {
  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      }}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Text style={styles.homeTitle}>
          Aytaç Seyahat Blog Sitesine Hoş Geldiniz!
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Oteller")}
        >
          <Text style={styles.buttonText}>🏨 Otelleri Görüntüle</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonAlt}
          onPress={() => navigation.navigate("Rezervasyonlar")}
        >
          <Text style={styles.buttonText}>📋 Rezervasyonlarım</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

// ----------------------- HOTELS SCREEN -----------------------
function HotelsScreen({ navigation }) {
  const [showForm, setShowForm] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);

  const handleReserve = (hotel) => {
    setSelectedHotel(hotel);
    setShowForm(true);
  };

  return (
    <View style={{ flex: 1, paddingTop: 50 }}>
      <FlatList
        data={HOTELS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.cardBody}>
              <Text style={styles.hotel}>{item.name}</Text>
              <Text style={styles.location}>{item.location}</Text>
              <Text style={styles.price}>{item.price}</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleReserve(item)}
              >
                <Text style={styles.button1Text}>Rezervasyon Yap</Text>
              </TouchableOpacity>
              {/* <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("Rezervasyonlar")}
              >
                <Text style={styles.buttonText}>Rezervasyonlarım</Text>
              </TouchableOpacity> */}
            </View>
          </View>
        )}
      />
      {selectedHotel && (
        <ReserveForm
          visible={showForm}
          hotel={selectedHotel}
          onClose={() => setShowForm(false)}
        />
      )}
    </View>
  );
}

// ----------------------- RESERVATIONS SCREEN -----------------------
function ReservationsScreen() {
  const [reservations, setReservations] = useState([]);

  const loadReservations = async () => {
    const data = await AsyncStorage.getItem("reservations");
    setReservations(data ? JSON.parse(data) : []);
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const deleteReservation = async (id) => {
    Alert.alert("Uyarı", "Rezervasyonu silmek istiyor musunuz?", [
      { text: "İptal", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          const updated = reservations.filter((r) => r.id !== id);
          setReservations(updated);
          await AsyncStorage.setItem("reservations", JSON.stringify(updated));
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, paddingTop: 50 }}>
      {reservations.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 50 }}>
          Henüz rezervasyon bulunmamaktadır.
        </Text>
      ) : (
        <FlatList
          data={reservations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.hotelImage }} style={styles.image} />
              <View style={styles.cardBody}>
                <Text style={styles.hotel}>{item.hotelName}</Text>
                <Text>👤 {item.name}</Text>
                <Text>👥 {item.people} kişi</Text>
                <Text>
                  📅 {item.checkIn} → {item.checkOut}
                </Text>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteReservation(item.id)}
                >
                  <Text style={{ color: "#fff" }}>Sil</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

// ----------------------- NAVIGATION -----------------------
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        {/* <Stack.Screen name="Oteller" component={HotelsScreen} /> */}
        <Stack.Screen
          name="Oteller"
          component={HotelsScreen}
          options={({ navigation }) => ({
            title: "Oteller",
            headerRight: () => (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#007bff",
                  paddingHorizontal: 10,
                  borderRadius: 20,
                  height: 40,
                  marginRight: 10,
                }}
                onPress={() => navigation.navigate("Rezervasyonlar")}
              >
                <Ionicons name="receipt-outline" size={20} color="#fff" />
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "bold",
                    marginLeft: 5,
                    fontSize: 14,
                  }}
                >
                  Rezervasyonlar
                </Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen name="Rezervasyonlar" component={ReservationsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ----------------------- STYLES -----------------------
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 10,
    overflow: "hidden",
    elevation: 4,
  },
  image: { width: "100%", height: 150 },
  cardBody: { padding: 15 },
  hotel: { fontSize: 18, fontWeight: "bold", color: "#0047ab" },
  location: { fontSize: 14, color: "#555" },
  price: { fontSize: 16, color: "#222", marginVertical: 5 },
  button: {
    backgroundColor: "#007bff",
    padding: 14,
    borderRadius: 10,
    marginVertical: 5,
    alignItems: "center",
    fontSize: 20,
  },
  buttonAlt: {
    backgroundColor: "#00c851",
    padding: 14,
    borderRadius: 10,
    marginVertical: 5,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  button1Text: { color: "#fff", fontWeight: "bold" },
  deleteButton: {
    backgroundColor: "#ff3b30",
    padding: 8,
    borderRadius: 8,
    marginTop: 5,
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#003366",
    marginBottom: 15,
    textAlign: "center",
  },
  homeTitle: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#e0e7ff",
    borderRadius: 25,
    marginVertical: 5,
  },
  dateText: { fontSize: 16, color: "#003366", marginLeft: 8 },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  saveButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 25,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#ff3b30",
    padding: 12,
    borderRadius: 25,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
  },
  background: { flex: 1, resizeMode: "cover" },
});
