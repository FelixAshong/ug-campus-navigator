import { StyleSheet, View, Image, Dimensions, ScrollView } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// Image assets - using @/assets alias
const images = {
  balmeLibrary: require('@/assets/images/ug/balme-library.jpg'),
  diaspora: require('@/assets/images/ug/Diaspora.jpg'),
  greatHall: require('@/assets/images/ug/great-hall.jpg'),
  night: require('@/assets/images/ug/night.jpg'),
  campusView: require('@/assets/images/ug/campus-view.jpg'),
  ugMain: require('@/assets/images/ug/ug-main.jpg'),
};

// Debug image paths
console.log('Image paths:', {
  balmeLibrary: images.balmeLibrary,
  diaspora: images.diaspora,
  greatHall: images.greatHall,
  night: images.night,
  campusView: images.campusView,
  ugMain: images.ugMain
});

interface Feature {
  id: string;
  title: string;
  description: string;
  image: keyof typeof images;
}

const features: Feature[] = [
  {
    id: '1',
    title: 'Explore the Campus',
    description: 'Navigate through the beautiful University of Ghana campus with ease. Find buildings, departments, and facilities quickly.',
    image: 'campusView',
  },
  {
    id: '2',
    title: 'Find Your Way',
    description: 'Get turn-by-turn directions to any location on campus. Choose your preferred mode of transportation.',
    image: 'greatHall',
  },
  {
    id: '3',
    title: 'Night Market',
    description: 'Experience the vibrant night market at the University of Ghana, where students gather for food, shopping, and socializing.',
    image: 'night',
  },
];

const { width: screenWidth } = Dimensions.get('window');

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#003366', dark: '#1D3D47' }}
      headerImage={
        <View style={styles.headerImageContainer}>
          <Image
            source={images.balmeLibrary}
            style={styles.headerImage}
            onError={(e) => {
              console.log('❌ Error loading header image:', e.nativeEvent.error);
              console.log('Image source:', images.balmeLibrary);
            }}
            onLoad={() => console.log('✅ Header image loaded')}
          />
          <View style={styles.headerOverlay}>
            <ThemedText style={styles.headerText}>University of Ghana</ThemedText>
            <ThemedText style={styles.headerSubtext}>Est. 1948</ThemedText>
          </View>
        </View>
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome to UG Campus Navigator!</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.carouselContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContent}
        >
          {features.map((item) => (
            <ThemedView key={item.id} style={styles.featureContainer}>
              <View style={styles.featureImageContainer}>
                <Image
                  source={images[item.image]}
                  style={styles.featureImage}
                  resizeMode="cover"
                  onError={(e) => {
                    console.log(`❌ Error loading ${item.title} image:`, e.nativeEvent.error);
                    console.log('Image source:', images[item.image]);
                  }}
                  onLoad={() => console.log(`✅ ${item.title} image loaded`)}
                />
                <View style={styles.featureOverlay} />
              </View>
              <ThemedView style={styles.featureTextContainer}>
                <ThemedText type="subtitle">{item.title}</ThemedText>
                <ThemedText>{item.description}</ThemedText>
              </ThemedView>
            </ThemedView>
          ))}
        </ScrollView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
  },
  headerImageContainer: {
    height: 200,
    width: '100%',
    position: 'relative',
    backgroundColor: '#003366',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 51, 102, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  headerSubtext: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.8,
    marginTop: 4,
  },
  carouselContainer: {
    marginVertical: 20,
  },
  carouselContent: {
    paddingHorizontal: 20,
    gap: 20,
  },
  featureContainer: {
    width: 300,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureImageContainer: {
    height: 200,
    width: '100%',
    position: 'relative',
  },
  featureImage: {
    height: '100%',
    width: '100%',
    backgroundColor: '#f0f0f0',
  },
  featureOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  featureTextContainer: {
    padding: 16,
  },
});
