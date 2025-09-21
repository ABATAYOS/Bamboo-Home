import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Alert, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig';
import { collection, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const categoryOptions = [
  'All',
  'Giant Bamboo',
  'Golden Bamboo',
  'Chinese Bamboo',
  'Timber Bamboo'
];


const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [filter, setFilter] = useState('All');
  const [filterOpen, setFilterOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); 
  const router = useRouter();

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'goals'),
      where('userId', '==', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setGoals(list);
    });

    return unsubscribe;
  }, []);

  const formatDate = (ts) => {
    if (!ts) return '';
    try {
      if (ts.toDate) return ts.toDate().toLocaleDateString();
      if (ts.seconds) return new Date(ts.seconds * 1000).toLocaleDateString();
      return new Date(ts).toLocaleDateString();
    } catch (e) {
      return '';
    }
  };

  const filteredGoals = goals.filter(g => {
    if (filter === 'All') return true;
    return (g.category || '').toLowerCase() === filter.toLowerCase();
  });

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to remove this from Bamboo Home?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const docRef = doc(db, 'goals', id);
              await deleteDoc(docRef);
              console.log('Deleted:', id);
            } catch (error) {
              console.log('Error deleting item:', error);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.goalItem}>
      {item.image ? <Image source={{ uri: item.image }} style={styles.image} /> : null}

      <View style={styles.rowBetween}>
        <Text style={styles.goalText}>{item.title || 'Unnamed Item'}</Text>
        <Text style={styles.priceText}>{item.price ? `₱${item.price}` : ''}</Text>
      </View>

      <Text style={styles.categoryText}>🎍 {item.category || 'Unspecified Bamboo'}</Text>
      <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>

      {item.description ? <Text numberOfLines={2} style={styles.desc}>{item.description}</Text> : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🌿 Bamboo Home Items</Text>

      {/* Filter */}
      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.filterToggle} onPress={() => setFilterOpen(o => !o)}>
          <Text style={styles.filterToggleText}>{filter}</Text>
          <Ionicons name={filterOpen ? "chevron-up" : "chevron-down"} size={18} color="#2F5D50" />
        </TouchableOpacity>

        {filterOpen && (
          <View style={styles.filterOptions}>
            {categoryOptions.map(c => (
              <Pressable
                key={c}
                onPress={() => { setFilter(c); setFilterOpen(false); }}
                style={[styles.filterOption, filter === c && styles.activeFilterOption]}
              >
                <Text style={[styles.filterOptionText, filter === c && styles.activeFilterOptionText]}>{c}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {/* Product List */}
      <FlatList
        data={filteredGoals}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No items yet 🌱 Add one to your Bamboo Home!</Text>}
        contentContainerStyle={{ padding: 16 }}
      />

      {/* Floating Action Button */}
      <View style={styles.fabContainer}>
        {menuOpen && (
          <>
            <TouchableOpacity style={[styles.fabOption, { backgroundColor: '#4CAF50' }]} onPress={() => {
              if (goals[0]) router.push(`/goals/edit/${goals[0].id}`);
              setMenuOpen(false);
            }}>
              <Ionicons name="create" size={22} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.fabOption, { backgroundColor: '#E53935' }]} onPress={() => {
              if (goals[0]) handleDelete(goals[0].id);
              setMenuOpen(false);
            }}>
              <Ionicons name="trash" size={22} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.fabOption, { backgroundColor: '#555' }]} onPress={() => {
              signOut(auth);
              setMenuOpen(false);
            }}>
              <Ionicons name="log-out" size={22} color="white" />
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity style={styles.fabMain} onPress={() => setMenuOpen(o => !o)}>
          <Ionicons name={menuOpen ? "close" : "menu"} size={26} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Goals;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F9F4' }, // soft green bg
  title: { fontSize: 26, fontWeight: 'bold', color: '#2F5D50', textAlign: 'center', marginVertical: 20 },

  filterRow: { paddingHorizontal: 16 },
  filterToggle: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#DDE5DC' },
  filterToggleText: { fontSize: 16, fontWeight: '500', color: '#2F5D50' },
  filterOptions: { marginTop: 8, backgroundColor: 'white', borderWidth: 1, borderColor: '#DDE5DC', borderRadius: 12, overflow: 'hidden' },
  filterOption: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  filterOptionText: { fontSize: 16, color: '#2F5D50' },
  activeFilterOption: { backgroundColor: '#4CAF50' },
  activeFilterOptionText: { color: '#fff', fontWeight: '600' },

  goalItem: { padding: 14, marginVertical: 8, backgroundColor: 'white', borderRadius: 14, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  image: { width: '100%', height: 180, borderRadius: 12, marginBottom: 10 },
  goalText: { fontSize: 18, fontWeight: '700', color: '#2F5D50' },
  priceText: { fontSize: 16, color: '#4CAF50', fontWeight: '600' },
  categoryText: { marginTop: 6, color: '#388E3C', fontWeight: '500' },
  dateText: { fontSize: 12, color: '#888', marginTop: 4 },
  desc: { marginTop: 8, color: '#444' },
  emptyText: { textAlign: 'center', marginTop: 40, fontStyle: 'italic', color: '#666' },

  fabContainer: { position: 'absolute', bottom: 30, right: 20, alignItems: 'center' },
  fabMain: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#2F5D50', justifyContent: 'center', alignItems: 'center', elevation: 6 },
  fabOption: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 12, elevation: 4 },
});
