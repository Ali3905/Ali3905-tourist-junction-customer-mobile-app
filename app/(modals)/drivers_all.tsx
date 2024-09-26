import { ActivityIndicator, Alert, Image, Linking, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '@/context/GlobalProvider'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/constants/Colors'
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons'

import { State, City } from "country-state-city"
import { Picker } from "@react-native-picker/picker";

interface DriverCardProps {
    driver: Driver;
    handlePress: (number: string) => void;
    handleViewImage: (imageUri: string) => void;
}

interface ImageModalProps {
    selectedImage: string;
    isImageModalVisible: boolean;
    handleCloseModal: () => void;
}

const DriversScreen = () => {

    const [drivers, setDrivers] = useState<Driver[]>([])

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const { apiCaller, setRefresh } = useGlobalContext()
    const [isImageModalVisible, setIsImageModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
    const [selectedState, setSelectedState] = useState<string>("PB")
    const [selectedCity, setSelectedCity] = useState<string>("")

    const states = State.getStatesOfCountry("IN")
    const cities = City.getCitiesOfState("IN", selectedState)


    const fetchDrivers = async () => {
        try {
            setIsLoading(true)
            const res = await apiCaller.get(`/api/driver/all`)
            const filteredData = res.data.data.filter((dri: Driver) => {
                return dri.vehicleType === "CAR" || dri.vehicleType === "ALL"
            })
            setDrivers(filteredData)
        } catch (error: any) {
            console.log(error.response.data.message);
            console.log(error);
            Alert.alert("Could not fetch the drivers at the moment")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchDrivers()
    }, [])

    const handlePress = (number: string) => {
        Linking.openURL(`tel:${number}`);
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        const id = setTimeout(() => {
            // console.log('Showing modal');
            // setModalVisible(true);
        }, 100);
        setTimeoutId(id);
    };

    const handleViewImage = (imageUri: string) => {
        if (!imageUri) {
            Alert.alert("", "This image is not available")
            return;
        }
        setSelectedImage(imageUri);
        setIsImageModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsImageModalVisible(false)
        setSelectedImage(null)
    }

    const filterDrivers = (city: string) => {
        return drivers.filter((driver) =>
            driver.city.toLowerCase() === city.toLowerCase()
        );
    };

    const filteredDrivers = selectedCity ? filterDrivers(selectedCity) : drivers;

    return (
        <SafeAreaView style={styles.container}>
           
           <View style={styles.curveSection}>
                <View style={styles.searchContainer}>
                        <Picker
                            selectedValue={selectedState}
                            style={styles.vehiclePicker}
                            onValueChange={item => setSelectedState(item)}
                        >
                            <Picker.Item label="select state" value={"PB"} style={styles.picker}/>
                            {
                                states.map((state) => {
                                    return <Picker.Item label={state.name} value={state.isoCode} style={styles.picker} />
                                })
                            }
                        </Picker>
                    </View>

                    <View style={styles.searchContainer}>
                        <Picker
                            selectedValue={selectedCity}
                            style={styles.vehiclePicker}
                            onValueChange={item => {
                                setSelectedCity(item); console.log("cur", item);
                            }}
                        >
                            <Picker.Item label="Select City" value={""} style={styles.picker} />
                            {cities &&
                                cities.map((city) => {
                                    return <Picker.Item label={city.name} value={city.name}  />
                                })
                            }
                        </Picker>
                    </View>
           </View>

            {isLoading ? (
                <ActivityIndicator size="large" color={Colors.darkBlue} />
            ) : (
                <ScrollView style={styles.driversList}>
                    {filteredDrivers.map((driver) => {
                        return <DriverCard driver={driver} handleViewImage={handleViewImage} handlePress={handlePress} />
                    })}
                </ScrollView>
            )}
            <ImageModal selectedImage={selectedImage ? selectedImage : ""} isImageModalVisible={isImageModalVisible} handleCloseModal={handleCloseModal} />
        </SafeAreaView>
    )
}

const DriverCard = ({ driver, handlePress, handleViewImage }: DriverCardProps) => {
    return (
        <View key={driver._id} style={styles.card}>
            <View style={styles.imageContainer}>
                <TouchableOpacity onPress={() => handleViewImage(driver.photo)} >
                    <Image
                        source={driver.photo ? { uri: driver.photo } : require("@/assets/images/dummyAvatar.jpg")}
                        style={styles.driverImage}
                    />
                </TouchableOpacity>
            </View>
            <Text style={styles.cardText}>
                Name - <Text style={{ color: "black" }}>{driver.name}</Text>
            </Text>
            <View style={[{ marginBottom: 2, marginTop: 5, flexDirection: "row" }]}>
                <Text style={styles.cardText}>Mobile - </Text>
                <TouchableOpacity onPress={() => handlePress(driver.mobileNumber)}>
                    <MaterialIcons name="phone-in-talk" size={24} color={Colors.darkBlue} />
                </TouchableOpacity>
            </View>
            <Text style={styles.cardText}>
                City - <Text style={{ color: "black" }}>{driver.city}</Text>
            </Text>
            <Text style={styles.cardText}>
                State - <Text style={{ color: "black" }}>{driver.state}</Text>
            </Text>
            <Text style={styles.cardText}>
                Vehicle Type - <Text style={{ color: "black" }}>{driver.vehicleType}</Text>
            </Text>
            <View style={styles.aadharContainer}>
                {/* <Text style={styles.cardText}>Aadhar card</Text> */}
                <TouchableOpacity style={styles.viewAadharButton} onPress={() => handleViewImage(driver.aadharCard)}>
                    <Text style={styles.viewAadharButtonText}>View Aadhar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.viewAadharButton} onPress={() => handleViewImage(driver.license)}>
                    <Text style={styles.viewAadharButtonText}>View License</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.aadharContainer}>
                {/* <Text style={styles.cardText}>Driver License</Text> */}
                
            </View>
        </View>
    )
}

const ImageModal = ({ selectedImage, isImageModalVisible, handleCloseModal }: ImageModalProps) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isImageModalVisible}
            onRequestClose={handleCloseModal}
        >
            {/* <BlurOverlay visible={isImageModalVisible} onRequestClose={handleCloseModal} /> */}

            <View style={styles.modalContainer}>
                {selectedImage &&
                    <View style={styles.modalContent}>
                        <Image source={{ uri: selectedImage }} style={styles.modalImage} />
                        <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                }
            </View>
        </Modal>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding: 1,
        backgroundColor: "#EAEAEA",
    },
    picker: {
    fontSize:12,
       color:'gray'
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderColor: Colors.secondary,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 1,
        marginBottom: 10,
        backgroundColor:'#fff'
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        color: Colors.secondary,
    },
    curveSection: {
        backgroundColor:'#3086FF',
        padding: 10,
        margin:10,
        borderBottomLeftRadius: 20,  // Bottom-left corner radius
        borderBottomRightRadius: 20,
    },
    vehicleFilterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: '#ffffff',
        marginBottom: 1,
        borderColor: 'rgba(245, 245, 35, 0.8)',
        height: 10, 
        alignItems:'center' 
    },
    vehiclePicker: {
        flex: 1,
        marginHorizontal: 1,

    },
    // addButton: {
    //     backgroundColor: Colors.darkBlue,
    //     paddingVertical: 10,
    //     borderRadius: 5,
    //     alignItems: "center",
    //     marginBottom: 20,
    //     width: 140,
    // },
    addButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    driversList: {
        // flex: 1,
    },
    card: {
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 5,
        margin: 4,
        marginHorizontal:20,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        borderColor:Colors.secondary,
        borderWidth:1

        // position: "relative",
    },
    imageContainer: {
        position: "absolute",
        right: 30,
        top: 20,
    },
    driverImage: {
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginBottom: 10,
        gap: 50,
        alignItems: "center",
    },
    editButton: {
        backgroundColor: Colors.darkBlue,
        paddingHorizontal: 10,
        borderRadius: 5,
        paddingVertical: 5,
    },
    editButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    cardText: {
        marginBottom: 2,
        color: 'gray-400',
        fontWeight: "700",
        fontSize: 12,
    },
    aadharContainer: {
        flexDirection: "row",
        alignItems: "center",
        // justifyContent: "space-between",
        gap:4,
        paddingTop:4

    },
    viewAadharButton: {
        backgroundColor:'#3086FF',
        paddingHorizontal: 10,
        borderRadius: 5,
        paddingVertical: 5,
    },
    viewAadharButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 5,
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
        elevation: 5,
        minWidth: 300,
    },
    modalText: {
        marginBottom: 20,
        fontSize: 18,
        textAlign: "center",
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "center",
    },
    modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginHorizontal: 10,
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalImage: {
        width: 300,
        height: 400,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    closeButton: {
        backgroundColor: Colors.darkBlue,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
});


export default DriversScreen