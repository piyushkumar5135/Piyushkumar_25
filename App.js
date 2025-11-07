import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator, Alert, Linking, TextInput } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { fetchTrending, fetchPopular, fetchTopRated, fetchMovieDetails, searchMovies, img } from "./src/api/tmdb";

function PosterRow({ title, data, onPress }) {
  if (!data?.length) return null;
  return (
    <View style={{ marginTop: 16 }}>
      <Text style={{ color: "#fff", fontSize: 22, marginBottom: 8 }}>{title}</Text>
      <FlatList
        horizontal
        data={data}
        keyExtractor={(i) => String(i.id)}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onPress(item)} style={{ marginRight: 10 }}>
            <Image
              source={{ uri: img(item.poster_path) }}
              style={{ width: 120, height: 180, borderRadius: 10, backgroundColor: "#111" }}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

function HomeScreen({ navigation }) {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [top, setTop] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [t, p, r] = await Promise.all([
          fetchTrending(),
          fetchPopular(),
          fetchTopRated(),
        ]);
        setTrending(t.data.results || []);
        setPopular(p.data.results || []);
        setTop(r.data.results || []);
      } catch (e) {
        Alert.alert("Error", "Failed to fetch movies. Check your TMDB key and network.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#000", padding: 12 }}>
      <StatusBar barStyle="light-content" />
      <Text style={{ color: "#fff", fontSize: 28, fontWeight: "700", marginBottom: 8 }}>Netflix Clone</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Search')} style={{ backgroundColor: '#111', padding: 12, borderRadius: 8, marginBottom: 8 }}>
        <Text style={{ color: '#aaa' }}>Search movies…</Text>
      </TouchableOpacity>
      {loading ? <ActivityIndicator size="large" color="#fff" /> : (
        <>
          <PosterRow title="Trending" data={trending} onPress={(m) => navigation.navigate("Details", { id: m.id })} />
          <PosterRow title="Popular" data={popular} onPress={(m) => navigation.navigate("Details", { id: m.id })} />
          <PosterRow title="Top Rated" data={top} onPress={(m) => navigation.navigate("Details", { id: m.id })} />
        </>
      )}
      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

function DetailsScreen({ route }) {
  const { id } = route.params;
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchMovieDetails(id);
        setMovie(res.data);
      } catch (e) {
        Alert.alert("Error", "Failed to load details.");
      }
    })();
  }, [id]);

  if (!movie) {
    return (
      <View style={{ flex: 1, backgroundColor: "#000", alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  const trailer = movie?.videos?.results?.find(v => v.type === "Trailer" && v.site === "YouTube");

  const openTrailer = () => {
    if (trailer?.key) {
      Linking.openURL(`https://www.youtube.com/watch?v=${trailer.key}`);
    } else {
      Alert.alert("No trailer", "Trailer not available.");
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#000" }} contentContainerStyle={{ padding: 12 }}>
      <Image source={{ uri: img(movie.backdrop_path, "w780") || img(movie.poster_path, "w780") }}
             style={{ width: "100%", height: 220, borderRadius: 12, backgroundColor: "#111" }} />
      <Text style={{ color: "#fff", fontSize: 26, fontWeight: "700", marginTop: 12 }}>{movie.title}</Text>
      <Text style={{ color: "#aaa", marginTop: 8, lineHeight: 20 }}>{movie.overview || "No description."}</Text>

      <TouchableOpacity onPress={openTrailer}
        style={{ backgroundColor: "#e50914", paddingVertical: 12, borderRadius: 10, alignItems: "center", marginTop: 16 }}>
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>Play Trailer</Text>
      </TouchableOpacity>

      <View style={{ marginTop: 16 }}>
        <Text style={{ color: "#888" }}>Release: <Text style={{ color: "#fff" }}>{movie.release_date || "-"}</Text></Text>
        <Text style={{ color: "#888", marginTop: 4 }}>Rating: <Text style={{ color: "#fff" }}>{movie.vote_average?.toFixed(1) || "-"}</Text></Text>
      </View>
      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

function SearchScreen({ navigation }) {
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const runSearch = async (text) => {
    setQ(text);
    if (!text) { setResults([]); return; }
    try {
      setLoading(true);
      const res = await searchMovies(text);
      setResults(res.data.results || []);
    } catch (e) {
      Alert.alert("Error", "Search failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000', padding: 12 }}>
      <TextInput
        value={q}
        onChangeText={runSearch}
        placeholder="Search movies…"
        placeholderTextColor="#777"
        style={{ backgroundColor: '#111', color: '#fff', padding: 12, borderRadius: 8, marginBottom: 12 }}
      />
      {loading ? <ActivityIndicator size="large" color="#fff" /> : (
        <FlatList
          data={results}
          keyExtractor={(i) => String(i.id)}
          numColumns={3}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('Details', { id: item.id })} style={{ marginBottom: 10 }}>
              <Image source={{ uri: img(item.poster_path) }} style={{ width: 110, height: 165, borderRadius: 8, backgroundColor: '#111' }} />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#000" },
          headerTintColor: "#fff",
          contentStyle: { backgroundColor: "#000" },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Home" }} />
        <Stack.Screen name="Search" component={SearchScreen} options={{ title: "Search" }} />
        <Stack.Screen name="Details" component={DetailsScreen} options={{ title: "Details" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
