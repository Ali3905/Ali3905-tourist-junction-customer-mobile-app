import React, { useState, useRef } from 'react';
import { StyleSheet, StatusBar, View, Text, Image, TouchableOpacity, Dimensions, ScrollView, Modal } from 'react-native';
// import { Video } from 'expo-av';
import Carousel from 'react-native-reanimated-carousel';
// import { useGlobalContext } from '@/context/GlobalProvider';
import { Redirect, router } from 'expo-router';
import Loader from '@/components/loader';
import { Colors } from '@/constants/Colors';
import { GestureHandlerRootView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { useGlobalContext } from '@/context/GlobalProvider';
import * as SecureStore from "expo-secure-store";

import { Ticket, TentTree, PersonStanding, CarFront, Wrench,Facebook , Car, FileCheck2, History, Handshake,Instagram  } from 'lucide-react-native';


const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const carouselImages = [
  require('@/assets/images/carousel1.png'),
  require('@/assets/images/carousel2.png'),
  require('@/assets/images/carousel3.png'),
  require('@/assets/images/carousel4.png'),
  require('@/assets/images/carousel5.png'),
  require('@/assets/images/carousel6.png')
];

// const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

interface BlurOverlayProps {
  visible: boolean;
  onRequestClose: () => void;
}

const BlurOverlay: React.FC<BlurOverlayProps> = ({ visible, onRequestClose }) => (
  <Modal
    animationType="fade"
    transparent={true}
    visible={visible}
    onRequestClose={onRequestClose}
  >
    <TouchableWithoutFeedback onPress={onRequestClose}>
      {/* <BlurView intensity={90} tint="light" style={styles.overlay} /> */}
    </TouchableWithoutFeedback>
  </Modal>
);

export default function HomeScreen() {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const { isLogged, setIsLogged, setToken, setRefresh, userData } = useGlobalContext()

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await SecureStore.deleteItemAsync("access_token");
      setIsLogged(false);
      setToken(null);
      setRefresh(prev => !prev)
      router.push('/')
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setIsLoading(false)
    }
  };




  if (isLoading) {
    return (
      <View style={styles.container}>
        <Loader loading />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container} >
      <View style={{
        padding: 20,
        backgroundColor: '#3086FF',
        flexDirection: "row",
        justifyContent: "space-between"
        
      }}>
        <Text style={{ fontSize: 15, fontWeight: '500', color: "white" }}>Hi, {userData?.userName}</Text>
        {!isLogged ? <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/signup')}>
          <Text>Signup</Text>
        </TouchableOpacity> : <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={{color:'#ffffff'}}>Logout</Text>
        </TouchableOpacity>}
      </View>
      <ScrollView>
        <View style={styles.logoContainer}>
          <Image source={require('@/assets/bg.png')} style={styles.image} />
        </View>


        {/* <View style={styles.carouselContainer}>
          <Carousel
            width={deviceWidth * 0.9}
            height={deviceWidth * 0.6}
            autoPlay
            data={carouselImages}
            renderItem={({ item }) => (
              <Image source={item} style={styles.carouselImage} />
            )}
          />
        </View> */}

        {/* <View style={styles.dividerContainer}>
          <View style={styles.divider}>
            <Text style={styles.dividerText}>Our Services</Text>
          </View>
        </View> */}

        <View style={styles.grid}>
          <TouchableOpacity onPress={() => router.push('/bus_tickets')} style={styles.gridItem}>
            {/* <Image source={require('@/assets/images/route.png')} style={styles.icon} /> */}
            <Ticket size={40} style={styles.icon} />
            <Text style={styles.iconText} numberOfLines={2} ellipsizeMode="tail">Bus Tickets</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/holiday_yatra')} style={styles.gridItem}>
            {/* <Image source={require('@/assets/images/holiday_new.png')} style={styles.iconEmpty} /> */}
            <TentTree size={40} style={styles.icon}/>
            <Text style={styles.iconText} numberOfLines={2} ellipsizeMode="tail">Holiday's & Yatra</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/drivers_all')} style={styles.gridItem}>
            {/* <Image source={require('@/assets/images/emergency-driver-icon.png')} style={styles.icon} /> */}
            <PersonStanding size={40} style={styles.icon} />
            <Text style={styles.iconText} numberOfLines={2} ellipsizeMode="tail">Drivers for you</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/hire_vehicles')} style={styles.gridItem}>
            {/* <Image source={require('@/assets/images/staff_details.png')} style={styles.icon} /> */}
            <CarFront size={40} style={styles.icon} />
            <Text style={styles.iconText} numberOfLines={2} ellipsizeMode="tail">Vehicles on Rent</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/technician_support')} style={styles.gridItem}>
            {/* <Image source={require('@/assets/images/technician_support.png')} style={styles.icon} /> */}
            <Wrench size={40} style={styles.icon}/>
            <Text style={styles.iconText} numberOfLines={2} ellipsizeMode="tail">Technicians</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/vehicle_list')} style={styles.gridItem}>
            {/* <Image source={require('@/assets/images/vehicle_management.png')} style={styles.icon} /> */}
            <Car size={40} style={styles.icon} />
            <Text style={styles.iconText} numberOfLines={2} ellipsizeMode="tail">Add my car</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/vehicle_documents')} style={styles.gridItem}>
            {/* <Image source={require('@/assets/images/vehicle_documents.png')} style={styles.icon} /> */}
            <FileCheck2 size={40} style={styles.icon}/>
            <Text style={styles.iconText} numberOfLines={2} ellipsizeMode="tail">Vehicle Documents</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/vehicle_servicing_history')} style={styles.gridItem}>
            {/* <Image source={require('@/assets/images/vehicle_servicing_history.png')} style={styles.icon} /> */}
            <History size={40} style={styles.icon}/>
            <Text style={styles.iconText} numberOfLines={2} ellipsizeMode="tail">Vehicle Servicing History</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/sell_vehicle_list')} style={styles.gridItem}>
            {/* <Image source={require('@/assets/images/empty-vehicle-icon.png')} style={styles.iconEmpty} /> */}
            <Handshake size={40} style={styles.icon}/>
            <Text style={styles.iconText} numberOfLines={2} ellipsizeMode="tail">Sell Vehicles</Text>
          </TouchableOpacity>

        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.divider}>
            <Text style={styles.dividerText}>Get in Touch</Text>
          </View>
        </View>

        <View style={styles.socialMediaContainer}>
          <TouchableOpacity
            style={styles.socialMediaIcon}
            onPress={() => Linking.openURL('https://www.instagram.com/touristjunctionpvtltd?igsh=MWlkZWY1aGtsc3U5Ng==')}
          >
            {/* <AntDesign name="instagram" size={24} color={Colors.primary} /> */}
            <Instagram size={25} style={{color:'#dc143c'}}/>
            <Text style={styles.socialText}>Instagram</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.socialMediaIcon}
            onPress={() => Linking.openURL('https://www.facebook.com/profile.php?id=100077968170241&mibextid=kFxxJD')}
          >
            <AntDesign name="facebook-square" size={24} color={'#3086FF'} />
            {/* <Facebook size={30} style={{color:'#3086FF'}} /> */}
            <Text style={styles.socialText}>Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.socialMediaIcon}
            onPress={() => Linking.openURL('https://youtube.com/@touristjunction4999?si=R80i9A17olOBrdzX')}
          >
            <AntDesign name="youtube" size={24} color={'#dc143c'} />
            <Text style={styles.socialText}>YouTube</Text>
          </TouchableOpacity>
        </View>

        {/* <View style={styles.dividerContainer}>
          <View style={styles.divider}>
            <Text style={styles.dividerText}>Contact Us</Text>
          </View>
          <Text style={{ marginVertical: 10, marginTop: 17, fontSize: 15 }}>touristjunction8@gmail.com</Text>
        </View> */}
      </ScrollView>


      <Modal
        animationType="slide"
        transparent={true}
        visible={showVideoModal}
        onRequestClose={() => setShowVideoModal(false)}
      >
        <BlurOverlay visible={showVideoModal} onRequestClose={() => setShowVideoModal(false)} />
        {/* 
        <View style={styles.modalContainer}>
          <View style={!selectedVideo ? styles.modalContentOverdide : styles.modalContent}>
            <Video
              ref={videoRef}
              source={!selectedVideo ? require('@/assets/videos/video2.mp4') : require('@/assets/videos/video1.mp4')}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              shouldPlay={isPlaying}
              //@ts-ignore
              resizeMode="cover"
              isLooping
              style={[styles.cardVideo, !selectedVideo && { height: 200 }]}
            />
            <TouchableOpacity style={styles.playPauseButton} onPress={handlePlayPause}>
              <AntDesign style={isPlaying && { opacity: 0.1 }} name={isPlaying ? 'pausecircle' : 'playcircleo'} size={40} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowVideoModal(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View> */}
      </Modal>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
     backgroundColor: 'rgba(245, 245, 35, 0.8)',
    marginTop: StatusBar.currentHeight,
  },
  gradientStart: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%', // Half the height for the first color
    backgroundColor: '#f5f523',
  },
  gradientEnd: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%', // Half the height for the second color
    backgroundColor: '#fa840e',
  },
  carouselContainer: {
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4

  },
  logoutButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 40,

  },

  carouselImage: {
    height: deviceWidth * 0.5,
    borderRadius: 10,
    width: deviceWidth * 0.9,
  },
  dividerContainer: {
    marginHorizontal: 20,
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary,
    width: '100%',
    position: 'relative',
    alignItems: 'center',
    borderRadius:100
  },
  dividerText: {
    position: 'absolute',
    backgroundColor: '#3086FF',
    paddingHorizontal: 10,
    top: -10,
    color: '#fff',
    fontWeight: '700',
    borderRadius:100
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    // marginVertical: 2,
    borderRadius: 20,
    borderColor: '#1F2657', // Border color
    borderWidth: 1,
    padding: 20,            // Increase padding for more spacing
    marginHorizontal: 10,
    // marginBottom: 20,       // Increase margin from the bottom to create overlap
    zIndex: 10,             // Lower zIndex compared to the image
    position: 'relative',
    backgroundColor:'#3086FF'
  },

  gridItem: {
    width: '30%', // Approximate one-third of the screen
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 5,
  },
  icon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    color:'#ffffff'
  },
  iconEmpty: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  iconText: {
    marginTop: 5,
    fontSize: Math.min(12, deviceHeight * 0.02), // Larger and more dynamic font size for better readability
    color: '#fff', // Assuming the primary color is black
    textAlign: 'center',
    fontWeight: '200',
    width: '100%',
    flexWrap: 'wrap', // Ensuring text wraps correctly
  },
  logoContainer: {
    // alignItems: 'center',
    // marginVertical: 1,
    // width: '100%', // Full width
    height: 200,
    // borderRadius: 20,
    padding:10
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: Colors.secondary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    alignItems: 'center',
    margin: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  cardVideo: {
    width: '100%',
    height: "90%",
    borderRadius: 15,
  },
  playPauseButton: {
    position: 'absolute',
    top: '40%',
    left: '45%',
    zIndex: 1,
  },
  cardText: {
    marginTop: 10,
    marginBottom: 5,
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 12,
    paddingVertical: 2,
    fontWeight: '600',
  },
  whatsNewHeading: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.primary,
    textAlign: 'center',
    marginVertical: 20,
  },
  whatsNewVideoContainer: {
    position: 'relative',
    alignSelf: 'center',
  },
  whatsNewVideo: {
    width: deviceWidth * 0.9,
    height: deviceWidth * 0.5,
    borderRadius: 15,
  },
  playPauseButtonWhatsNew: {
    position: 'absolute',
    top: '40%',
    left: '45%',
    zIndex: 1,
  },
  socialMediaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 20,
    marginBottom: 20
  },
  socialMediaIcon: {
    alignItems: 'center',
  },
  socialIcon: {
    width: 50,
    height: 50,
  },
  socialText: {
    marginTop: 5,
    fontSize: 11,
    color: Colors.primary,
    textAlign: 'center',
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 5,
    width: "90%",
    alignItems: "center",
    marginVertical: 20
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
  },
  modalImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: Colors.darkBlue,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalContentOverdide: {
    backgroundColor: "#fff",
    borderRadius: 5,
    width: "90%",
    alignItems: "center",
    marginVertical: 20,
    height: "70%",
    justifyContent: "center",
    paddingTop: 50,
    gap: 100
  },
  image: {
    width: '100%',
    height: '100%',
    // resizeMode: 'contain',
    borderRadius: 20,
    paddingHorizontal:10
    
  },



});