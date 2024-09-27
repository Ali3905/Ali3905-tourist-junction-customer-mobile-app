import { ActivityIndicator, Alert, Dimensions, Image, ScrollView,TextInput, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '@/context/GlobalProvider'
import { router } from 'expo-router'
// import Carousel from 'react-native-reanimated-carousel'
import Carousel from '@/components/Carousel'
import { Colors } from '@/constants/Colors'
import { City } from 'country-state-city'
import { Picker } from '@react-native-picker/picker'
import { Search } from 'lucide-react-native';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export default function HolidayYatraScreen() {
    const [tours, setTours] = useState<Tour[]>([])

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { apiCaller } = useGlobalContext()

    const [selectedLocation, setSelectedLocation] = useState<string>("")
    const [searchQuery, setSearchQuery] = useState<string>("");

    const cities = City.getCitiesOfCountry("IN")

    const fetchTours = async () => {
        setIsLoading(true)
        try {
            const res = await apiCaller.get("/api/tour/agency/all")
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
            !searchQuery
                ? true
                : tour.name?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    const filteredTours = searchQuery ? filterTours() : tours;

    const handleSearch = () => {
        const result = filterTours();
        setTours(result);
    };


    useEffect(() => {
        fetchTours()
    }, [])

    return (
        <View style={styles.container}>
             

           <View style={styles.curveSection}>
           <TouchableOpacity onPress={() => router.push("/favourite_holiday_yatra")} style={styles.addButton}>
                <Text style={styles.addButtonText}>My Favourite Holidays</Text>
            </TouchableOpacity>
                        {/* Search Input with Icon */}
             <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by tour name"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <TouchableOpacity onPress={handleSearch} style={styles.searchIcon}>
                    <Search size={24} color={Colors.darkBlue} />
                </TouchableOpacity>
            </View>

          <View style={styles.vehicleFilterContainer}>
            <Picker
                selectedValue={selectedLocation}
                style={styles.vehiclePicker}
                itemStyle={selectedLocation === "" ? styles.placeholderStyle : styles.itemStyle}
                onValueChange={item => setSelectedLocation(item)}
            >
                <Picker.Item label="Select Cities" value="" style={styles.picker} />
                {cities?.map((city) => (
                    <Picker.Item key={city.name} label={city.name} value={city.name} />
                ))}
            </Picker>
           </View>
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
    const { apiCaller, isLogged } = useGlobalContext()
    const [favouriteTours, setFavouriteTours] = useState<string[]>([]);
    
    

    const handleAddToFavourite = async (id: string) => {
        setIsLoading(true);
        try {
            // Make the API call to add the tour to favourites
            const res = await apiCaller.patch(`/api/tour/addToFavourite?tourId=${id}`);
            
            // Assuming the response includes the updated list of favourite tours or a success message
            if (res.data.success) {
                // Update state or perform any necessary actions on success
                setFavouriteTours(prev => [...prev, id]); // Add the new favorite tour ID to the state
                Alert.alert("Success", "This tour has been added to your favourites.");
            }
        } catch (error: any) {
            console.log(error?.response?.data?.message || error);
            Alert.alert("Error", error?.response?.data?.message || "Could not add to favourites.");
        } finally {
            setIsLoading(false); // Ensure loading state is reset
        }
    };

    return (
        <>
            <View style={styles.card}>

                {/* <Image source={{ uri: tour.photo }} height={350} /> */}
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    {/* <View style={{ position: 'relative' }}> */}
                    <Carousel
                        
                        images={tour.photos}
                        height={380}
                    />
                    {/* </View> */}
                </View>
                {/* <Image source={{ uri: item }} style={styles.carouselImage} /> */}

                <Text style={styles.cardText1}>{tour?.agencyName}<Text style={{ color: "black" }}></Text></Text>
                <View style={{ padding: 1 }}>
                    {/* <PhoneNumbersList phoneNumbers={[tour?.primaryMobileNumber, tour?.secondaryMobileNumber]} /> */}
                </View>
                <Text style={styles.cardText}>Office Address -  <Text style={{ color: "black" }}>{tour?.officeAddress}</Text></Text>
                <Text style={styles.cardText}>Tour Name - <Text style={{ color: "black" }}>{tour?.name}</Text></Text>
                <Text style={styles.cardText}>Location - <Text style={{ color: "black" }}>{tour?.location}</Text></Text>
                <Text style={styles.cardText}>Mobile Number - <Text style={{ color: "black" }}>{tour?.primaryMobileNumber}</Text></Text>
                {isLogged && (
                <View style={styles.modalButtons}>
                    {!favouriteTours.includes(tour._id) ? ( // Check if the tour is already in favourites
                        <TouchableOpacity
                            style={[styles.modalButton, { backgroundColor: '#3086FF' }]}
                            onPress={() => handleAddToFavourite(tour._id)}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={[styles.modalButtonText, { color: "#fff" }]}>Add To Favourite</Text>
                            )}
                        </TouchableOpacity>
                    ) : (
                        <Text style={styles.modalButtonText}>Added to Favourites</Text> // Optional message
                 )}
                </View>
            )}
            </View>

        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        
        // backgroundColor: "#3086FF",
    },
     
    picker:{
       fontSize:14,
       color:'gray'
    },

    searchContainer: {
       
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'rgba(245, 245, 35, 0.8)',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 5,
        backgroundColor:'#fff',
        

    },
    curveSection: {
        backgroundColor:'#3086FF',
        padding: 10,
        margin:10,
        borderBottomLeftRadius: 20,  // Bottom-left corner radius
        borderBottomRightRadius: 20,
    },
    searchInput: {
       
        flex: 1,  // Ensures the input takes up most of the space
        height: 35,

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
        borderRadius: 10,
        backgroundColor: '#ffffff',
        marginBottom: 1,
        borderColor: 'rgba(245, 245, 35, 0.8)',
        height: 35, 
        alignItems:'center' 
        // paddingVertical: 5,
    },
    vehiclePicker: {
        flex: 1,
        marginHorizontal: 2,
        borderColor: Colors.secondary,
        borderWidth: 1,
        height: 35,
    },
    placeholderStyle: {
        color: '#aaa',  // Light grey for placeholder
        fontSize: 16,   // You can adjust the size of the text
    },
    itemStyle: {
        color: '#000',  // Regular text color for selected cities
        fontSize: 16,   // Adjust the size to match
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
        margin:10,
        padding: 4,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 8,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        borderColor:Colors.secondary,
        borderWidth: 1, 
       marginTop:10     
  
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
        color: 'gray-400',
        fontWeight: "500",
        fontSize: 10,
    },
    cardText1: {
        marginBottom: 1,
        color: '#26355E',
        fontWeight: "900",
        fontSize: 15,
    },
    image: {
        width: '100%',
        height: deviceHeight * 0.3,
    },
    addButton: {
        // backgroundColor: Colors.darkBlue,
        borderRadius: 8,
        padding: 4,
        paddingHorizontal: 1,
        alignItems: "center",
        marginBottom: 10,
        width: 100,
        backgroundColor: 'rgba(245, 245, 35, 0.8)',
        
    },
    addButtonText: {
        color: "#000",
        fontSize: 12,
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
        padding: 8,
        elevation: 2,
        // marginHorizontal: 5,
        width: "100%",
        alignItems: "center",
    },
    modalButtonText: {
        color: "white",
        fontWeight: "bold",
    },
    searchIcon: {
        marginLeft: 8,
        padding: 5,  // Adds touchable area around the icon
    },
});