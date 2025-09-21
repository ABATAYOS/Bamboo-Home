import { useState } from 'react'
import { StyleSheet, Text, TextInput, Pressable, Keyboard, View, Image, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGoals } from '../../hooks/useGoals'
import { useRouter } from 'expo-router'
import { auth } from '../../firebaseConfig'
import * as ImagePicker from 'expo-image-picker'
import { Picker } from '@react-native-picker/picker'

const Create = () => {
  const [goal, setGoal] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Giant Bamboo')
  const [image, setImage] = useState(null)
  const { createGoal } = useGoals()
  const router = useRouter();

  const handleSubmit = async () => {
    if (!goal.trim()) return;

    await createGoal({
      title: goal,            
      progress: 0,
      userId: auth.currentUser.uid,  
      createdAt: new Date(),         
      price: price,
      description: description,
      category: category,
      image: image,   // save image URI
    })

    setGoal('')
    setPrice('')
    setDescription('')
    setCategory('Giant Bamboo')
    setImage(null)
    Keyboard.dismiss()
    router.push('/goals')
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.title}>🌿 Add a New Item</Text>

        {/* Product Name */}
        <TextInput
          style={styles.input}
          placeholder="Enter item name"
          value={goal}
          onChangeText={setGoal}
        />

        {/* Price */}
        <TextInput
          style={styles.input}
          placeholder="Enter price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />

        {/* Description */}
        <TextInput
          style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
          placeholder="Enter item description"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        {/* Category Dropdown */}
        <View style={styles.pickerContainer}>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
        >
          <Picker.Item label="🎍 Giant Bamboo" value="Giant Bamboo" />
          <Picker.Item label="🌱 Golden Bamboo" value="Golden Bamboo" />
          <Picker.Item label="🎋 Chinese Bamboo" value="Chinese Bamboo" />
          <Picker.Item label="🌳 Timber Bamboo" value="Timber Bamboo" />
        </Picker>
      </View>

        {/* Image Upload */}
        <Pressable onPress={pickImage} style={styles.uploadButton}>
          <Text style={styles.uploadText}>
            {image ? 'Change Image' : 'Upload Image'}
          </Text>
        </Pressable>

        {image && (
          <Image source={{ uri: image }} style={styles.previewImage} />
        )}

        {/* Submit */}
        <Pressable onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Add to Bamboo Home</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Create

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F9F4', // soft greenish background
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2F5D50', // deep green
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  input: {
    width: '100%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#DDE5DC',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  pickerContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#DDE5DC',
    overflow: 'hidden',
  },
  uploadButton: {
    padding: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    marginTop: 15,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  uploadText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  previewImage: {
    width: '100%',
    height: 180,
    marginTop: 15,
    borderRadius: 12,
  },
  button: {
    padding: 18,
    backgroundColor: '#2F5D50',
    borderRadius: 14,
    marginTop: 25,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 17,
  },
})
