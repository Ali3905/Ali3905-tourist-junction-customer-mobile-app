import { ActivityIndicator, Alert, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '@/context/GlobalProvider'
import { router } from 'expo-router'
// import Carousel from 'react-native-reanimated-carousel'
import Carousel from '@/components/Carousel'
import { Colors } from '@/constants/Colors'
import { City } from 'country-state-city'
import { Picker } from '@react-native-picker/picker'
import GoToLogin from '@/components/GoToLogin'

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export default function FavouriteHolidayYatraScreen() {
    const [tours, setTours] = useState<Tour[]>([])

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const { apiCaller, refresh, isLogged } = useGlobalContext()

    const [selectedLocation, setSelectedLocation] = useState<string>("")

    const cities = City.getCitiesOfCountry("IN")

    const fetchTours = async () => {
        setIsLoading(true)
        try {
            const res = await apiCaller.get("/api/tour/customer/favouriteTours")
            setTours(res.data.data)
        } catch (error: any) {
            console.log(error);
            console.log(error.response.data.message);
            Alert.alert("Error", "Failed to fetch tours. Please try again.");
        } finally {
            setIsLoading(false)
        }
    }


    const filterTours = () => {
        return tours.filter((tour) =>
            !selectedLocation ? true : tour.location?.toLowerCase().includes(selectedLocation.toLocaleLowerCase())
        );
    };

    const filteredTours = selectedLocation ? filterTours() : tours


    useEffect(() => {
        fetchTours()
    }, [refresh])
    
    if (!isLogged) {
        return <GoToLogin />
    }
    if (!isLoading && (!filteredTours || filteredTours.length < 1)) {
        return <Text style={{ textAlign: "center", marginTop: 10 }}>No Favourite Tours to show</Text>
    }


    return (
        <View style={styles.container}>
            <View style={styles.vehicleFilterContainer}>
                <Picker
                    selectedValue={selectedLocation}
                    style={styles.vehiclePicker}
                    onValueChange={item => setSelectedLocation(item)}
                >
                    <Picker.Item label="All Cities" value="" />
                    {
                        cities?.map((city) => (
                            <Picker.Item label={city.name} value={city.name} />
                        ))
                    }
                </Picker>
            </View>
            {
                isLoading ? (
                    <ActivityIndicator size="large" color={Colors.darkBlue} />
                ) :
                    <ScrollView style={styles.routesList}>
                        {filteredTours.map((tour) => {
                            return <TourCard tour={tour} />
                        })}
                    </ScrollView>
            }
        </View>
    )
}

const TourCard = ({ tour }: { tour: Tour }) => {

    const [isLoading, setIsLoading] = useState(false)
    const { apiCaller, setRefresh } = useGlobalContext()

    const handleAddToFavourite = async (id: string) => {
        setIsLoading(true)
        try {
            const res = await apiCaller.delete(`/api/tour/removeFromFavourite?tourId=${id}`)
            Alert.alert("Success", "This tour have been removed from the favourites")
            setRefresh(prev => !prev)
        } catch (error: any) {
            console.log(error?.response?.data?.message || error);
            Alert.alert("Error", error?.response?.data?.message || "Could not add to favourites")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <View style={styles.card}>

                {/* <Image source={{ uri: tour.photo }} height={350} /> */}
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    {/* <View style={{ position: 'relative' }}> */}
                    <Carousel
                        // width={deviceWidth * 0.9}
                        // height={deviceWidth * 0.6}
                        // // autoPlay
                        // data={tour?.photos}
                        // renderItem={({ item }) => (
                        //     <Image source={{ uri: item }} style={styles.carouselImage} />
                        // )}
                        images={tour.photos}
                        height={300}
                    />
                    {/* </View> */}
                </View>
                {/* <Image source={{ uri: item }} style={styles.carouselImage} /> */}

                <Text style={styles.cardText}>{tour?.agencyName}<Text style={{ color: "black" }}></Text></Text>
                <View style={{ padding: 1 }}>
                    {/* <PhoneNumbersList phoneNumbers={[tour?.primaryMobileNumber, tour?.secondaryMobileNumber]} /> */}
                </View>
                <Text style={styles.cardText}>Office Address:  <Text style={{ color: "black" }}>{tour?.officeAddress}</Text></Text>
                <Text style={styles.cardText}>Tour Name: <Text style={{ color: "black" }}>{tour?.name}</Text></Text>
                <Text style={styles.cardText}>Location: <Text style={{ color: "black" }}>{tour?.location}</Text></Text>
                <View style={styles.modalButtons}>
                    <TouchableOpacity
                        style={[styles.modalButton, { backgroundColor: Colors.darkBlue }]}
                        onPress={() => handleAddToFavourite(tour._id)}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={[styles.modalButtonText, { color: "#fff" }]}>Remove From Favourite</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>

        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: "#EAEAEA",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderColor: Colors.secondary,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 15,
        marginBottom: 20,
        paddingVertical: 5,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        color: Colors.secondary,
    },
    carouselImage: {
        height: deviceWidth * 0.5,
        borderRadius: 10,
        width: deviceWidth * 0.9,
    },
    vehicleFilterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: Colors.secondary,
    },
    vehiclePicker: {
        flex: 1,
        marginHorizontal: 2,
        borderColor: Colors.secondary,
        borderWidth: 1,
        borderRadius: 5,
    },

    notificationContainer: {
        marginVertical: 20,
        paddingHorizontal: 20,
        backgroundColor: '#51BEEE',
        borderRadius: 5,
        padding: 10,
    },
    routesList: {
        flex: 1
    },
    card: {
        backgroundColor: "#fff",
        padding: 4,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 8,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,

    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginBottom: 10,
        alignItems: "center",
        gap: 5,
    },
    editButton: {
        backgroundColor: Colors.darkBlue,
        borderRadius: 5,
        padding: 5,
    },
    editButtonText: {
        color: "#fff",
        fontSize: 12,
    },
    cardText: {
        marginBottom: 1,
        color: Colors.secondary,
        fontWeight: "500",
        fontSize: 12,
    },
    image: {
        width: '100%',
        height: deviceHeight * 0.3,
    },
    addButton: {
        backgroundColor: Colors.darkBlue,
        borderRadius: 8,
        padding: 8,
        paddingHorizontal: 1,
        alignItems: "center",
        marginBottom: 10,
        width: 200
    },
    addButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    modalButton: {
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        marginHorizontal: 5,
        width: "100%",
        alignItems: "center",
    },
    modalButtonText: {
        color: "white",
        fontWeight: "bold",
    },
});