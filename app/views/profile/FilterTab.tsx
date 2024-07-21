import Slider from "@react-native-community/slider";
import React, { FC, useEffect, useState } from "react";
import {
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
   Alert,
   ScrollView,
   ImageSourcePropType,
   Pressable 
} from "react-native";
import { Image } from 'expo-image';
import AnimalCheckbox from "@/ui/AnimalCheckbox";
import colors from "@/utils/colors";
import { Fonts } from "@/utils/fonts";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useDispatch, useSelector } from "react-redux";
import { getAuthState } from "@/store/auth";
import { Filter, getFilterState, upldateFilter } from "@/store/filter";
import { Keys, getFromAsyncStorage } from "@/utils/asyncStorage";
import SelectMultiple from "@/components/form/SelectMultiple";
import { upldateNotification } from "@/store/notification";
import * as ImagePicker from "expo-image-picker";
import CustomModal from "@/components/CustomModal";
import catchAsyncError from "@/api/catchError";
import client from "@/api/client";
import { useNavigation } from "expo-router";

interface Props {
   navigation:any
 }

const FilterTab: FC<Props> = ({ navigation }) => {
   const gefilters = useSelector(getFilterState);
   const dispatch = useDispatch();

   const { profile } = useSelector(getAuthState);
   const [filters, setFilters] = useState<Filter>(gefilters);
   const [modalPhotoVisible, setModalPhotoVisible] = useState(false);
   const [avatar, setAvatar] = useState<ImageSourcePropType | null>(null);
   const options = ["Paris", "Lyon", "Cannes", "Bordeaux"];

   const handleSelectFromGallery = async () => {
      setModalPhotoVisible(false);
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
         Alert.alert(
            "Permission refusée",
            "Vous devez autoriser l'accès à la galerie pour sélectionner une photo."
         );
         return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.All,
         allowsEditing: true,
         aspect: [1, 1],
         quality: 1,
      });

      if (!result.canceled) {
         await uploadFile(result);
      }
   };

   const DataURIToBlob = (dataURI: string) => {
      const splitDataURI = dataURI.split(",");
      const byteString =
         splitDataURI[0].indexOf("base64") >= 0
            ? atob(splitDataURI[1])
            : decodeURI(splitDataURI[1]);
      const mimeString = splitDataURI[0].split(":")[1].split(";")[0];

      const ia = new Uint8Array(byteString.length);
      for (let i = 0; i < byteString.length; i++)
         ia[i] = byteString.charCodeAt(i);

      return new Blob([ia], { type: mimeString });
   };

   const uploadFile = async (uploadImg: { canceled?: false; assets: ImagePicker.ImagePickerAsset[]; uri?: any; }) => {
      const asset = uploadImg.assets[0];
      const type = asset.type as string;

      // Change data to blob
      const file = DataURIToBlob(asset.uri);

      const formData = new FormData();
      formData.append("upload", file);
      formData.append("type", "User");
      formData.append("fileType", type);
      formData.append("fileUri", uploadImg.uri);

      const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);
      try {
         const response = await fetch(client + "upload/create/User", {
            method: "POST",
            body: formData,
            headers: {
               Authorization: "Bearer " + token,
            },
         });

         if (response.ok) {
            const data = await response.json();
            console.log(data);

            setAvatar(data.result)
         }
      } catch (error) {
         let errorResponse: any = await error;
         const errorMessage = catchAsyncError(errorResponse.error);
         dispatch(upldateNotification({ message: errorMessage, type: "error" }));
      }
   };

   const handleTakePhoto = async () => {
      setModalPhotoVisible(false);
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
         Alert.alert(
            "Permission refusée",
            "Vous devez autoriser l'accès à la caméra pour prendre une photo."
         );
         return;
      }
      const result = await ImagePicker.launchCameraAsync();
      if (!result.canceled) {
         // Faire quelque chose avec la photo prise
         console.log("Photo prise:", result);
      }
   };

   async function updateData() {
      try {
         const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);
         if (!token) return;
         const reponse = await fetch(
            client + "filter/update-filters",
            {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Origin": "*",
                  Authorization: `Bearer ${token}`,
               },
               body: JSON.stringify(filters),
            }
         );
         const data = await reponse.json();
         dispatch(upldateFilter(data.filter));
      } catch (error) {
         console.log("Filter error: " + error);
         dispatch(upldateNotification({ message: error as string, type: "error" }));
      }
   }

   useEffect(() => {
      const defaulImg = "https://img.welt.de/img/kultur/kino/mobile250641503/7172501337-ci102l-w1024/This-image-released-by-Netflix-show-7.jpg";
      if (profile?.avatar) {
         setAvatar({ uri: profile.avatar });
      } else {
         setAvatar({ uri: defaulImg });
      }
   }, [])


   useEffect(() => {
      updateData();
   }, [filters]);

   return (
      <ScrollView>
         <View
            style={{
               flex: 1,
               justifyContent: "center",
               alignItems: "center",
               marginTop: 40,
               paddingBottom: 10,
            }}
         >
            <View
               style={styles.imageBackground}
            >
               <Image style={styles.image} source={avatar ?? { uri: '' }} />
               <View style={{ alignSelf: "center", padding: 3 }}>
                  <Text style={styles.title}>{profile?.name}</Text>
                  <Pressable style={styles.buttonSetting} onPress={() => {navigation.navigate('SettingTab');}}>
                     <Text style={styles.textSetting}>Parametres</Text>
                  </Pressable>
               </View>
               <TouchableOpacity style={styles.editButton} onPress={() => setModalPhotoVisible(true)}>
                  <MaterialIcons
                     name="photo-camera"
                     size={25}
                     color={colors.DARK}
                     style={styles.photoIcon}
                  />
               </TouchableOpacity>

               <CustomModal
                  visible={modalPhotoVisible}
                  onSelectFromGallery={handleSelectFromGallery}
                  onTakePhoto={handleTakePhoto}
                  onClose={() => {
                     setModalPhotoVisible(!modalPhotoVisible);
                  }}
               />
            </View>
         </View>
         <View>
            <View style={styles.filterContainer}>
               <Text style={styles.label}>Je veux voir dans ces villes :</Text>
               <SelectMultiple
                  options={options}
                  setSelectedValues={(values: any) =>
                     setFilters({ ...filters, location: values })
                  }
                  selectedValues={filters.location ?? []}
               />
            </View>
            <View style={styles.filterContainer}>
               <Text style={styles.label}>Je veux voir :</Text>
               <View style={styles.filterAnimalsContainer}>
                  <AnimalCheckbox
                     icon="cat"
                     label="Chat"
                     isChecked={filters.isCat}
                     onPress={() =>
                        setFilters((prevFilters) => ({
                           ...prevFilters,
                           isCat: !prevFilters.isCat,
                        }))
                     }
                  />
                  <AnimalCheckbox
                     icon="dog"
                     label="Chien"
                     isChecked={filters.isDog}
                     onPress={() =>
                        setFilters((prevFilters) => ({
                           ...prevFilters,
                           isDog: !prevFilters.isDog,
                        }))
                     }
                  />
                  <AnimalCheckbox
                     icon="crow"
                     label="Oiseaux"
                     isChecked={filters.isBird}
                     onPress={() =>
                        setFilters((prevFilters) => ({
                           ...prevFilters,
                           isBird: !prevFilters.isBird,
                        }))
                     }
                  />
                  <AnimalCheckbox
                     icon="paw"
                     label="Autres"
                     isChecked={filters.isOther}
                     onPress={() =>
                        setFilters((prevFilters) => ({
                           ...prevFilters,
                           isOther: !prevFilters.isOther,
                        }))
                     }
                  />
               </View>
            </View>

            <View style={styles.filterContainer}>
               <Text style={styles.label}>Age Max : 0 - {filters.ageMax}</Text>
               <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={50}
                  step={1}
                  value={filters.ageMax ?? 0}
                  minimumTrackTintColor={colors.PRIMARY}
                  maximumTrackTintColor={colors.SECONDARY}
                  thumbTintColor={colors.ERROR}
                  onValueChange={(value) =>
                     setFilters((prevFilters) => ({
                        ...prevFilters,
                        ageMax: value,
                     }))
                  }
               />
            </View>
         </View>
      </ScrollView>
   );
};

const styles = StyleSheet.create({
   buttonSetting: {
      backgroundColor: colors.INACTIVE_CONTRAST,
      padding: 10,
      borderRadius: 5,
      marginTop: 20,
      textAlign: "center",
      borderWidth:1
   },
   textSetting:{
      textAlign: "center",
      color: colors.DARK,
      textTransform: "uppercase"
   },
   filterContainer: {
      margin: 20,
      backgroundColor: "#FFF",
      padding: 20,
      minHeight: 120
   },
   photoIcon: {
      textAlign: "center",
      marginTop: 8,
   },
   filterAnimalsContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      margin: 10,
      backgroundColor: "#FFF",
   },
   label: {
      fontSize: 16,
      fontFamily: Fonts.bold,
      marginBottom: 5,
   },
   input: {
      height: 40,
      borderColor: "gray",
      borderWidth: 1,
      marginBottom: 10,
      paddingHorizontal: 10,
   },
   slider: {
      width: "100%",
      height: 40,
   },
   sliderValue: {
      fontSize: 16,
      textAlign: "center",
   },
   image: {
      width: 150,
      height: 150,
      borderRadius: 100,
      marginBottom: 10,
   },
   title: {
      fontSize: 25,
      fontFamily: Fonts.bold,
   },
   editButton: {
      position: "absolute",
      bottom: 70,
      left: "65%",
      top: "40%",
      right: 0,
      backgroundColor: "rgba(255,255,255, 1)",
      borderColor: colors.SECONDARY,
      borderWidth: 2,
      borderRadius: 25,
      width: 40,
      height: 40,
   },
   imageBackground: {
      // resizeMode: "cover",
      // justifyContent: "center",
      // alignItems: "center",
   },
   heading: {
      fontSize: 24,
      fontWeight: 900,
      marginBottom: 20,
   },
   button: {
      backgroundColor: "#007AFF",
      padding: 10,
      borderRadius: 5,
      marginTop: 20,
   },
   buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: 900,
   },
});

export default FilterTab;
