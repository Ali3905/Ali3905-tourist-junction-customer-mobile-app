import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '@/context/GlobalProvider'
import { router } from 'expo-router'
import Carousel from 'react-native-reanimated-carousel'
import { Colors } from '@/constants/Colors'

export default function HolidayYatraScreen() {
    const [tours, setTours] = useState<Tour[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { apiCaller } = useGlobalContext()
    const [searchQuery, setSearchQuery] = useState("");

    const fetchTours = async () => {
        setIsLoading(true)
        try {
            const res = await apiCaller.get("/api/tour")
            setTours(res.data.data)
        } catch (error) {
            console.log(error);
            Alert.alert("Error", "Failed to add route. Please try again.");
        } finally {
            setIsLoading(false)
        }
    }


    const filterTours = (query: string) => {
        return tours.filter((tour) =>
            Object.values(tour).some((value) =>
                String(value).toLowerCase().includes(query.toLowerCase())
            )
        );
    };




    useEffect(() => {
        fetchTours()
    }, [])

    return (
        <View>
            {
                isLoading ? (
                    <ActivityIndicator size="large" color={Colors.darkBlue} />
                ) :
                    filterTours(searchQuery).map((tour) => {
                        return <TourCard tour={tour} />
                    })
            }
        </View>
    )
}

const TourCard = ({ tour }: { tour: Tour }) => {

    return (
        <>
            <View style={styles.card}>

                {/* <Image source={{ uri: tour.photo }} height={350} /> */}

                <Carousel images={tour.photos} height={500} />

                <Text style={styles.cardText}>{tour?.agencyName}<Text style={{ color: "black" }}></Text></Text>
                <View style={{ padding: 1 }}>
                    {/* <PhoneNumbersList phoneNumbers={[tour?.primaryMobileNumber, tour?.secondaryMobileNumber]} /> */}
                </View>
                <Text style={styles.cardText}>Office Address:  <Text style={{ color: "black" }}>{tour?.officeAddress}</Text></Text>
                <Text style={styles.cardText}>Tour Name: <Text style={{ color: "black" }}>{tour?.name}</Text></Text>
                <Text style={styles.cardText}>Location: <Text style={{ color: "black" }}>{tour?.location}</Text></Text>
            </View>

        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
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

    notificationContainer: {
        marginVertical: 20,
        paddingHorizontal: 20,
        backgroundColor: '#51BEEE',
        borderRadius: 5,
        padding: 10,
    },
    notificationText: {
        color: '#ffffff',
        fontSize: 16,
        textAlign: 'center',
    },
    card: {
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 5,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        marginBottom: 20,

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
        height: height * 0.3,
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
});