import React, { FC, useCallback, useEffect, useState } from "react";
import {
   Alert,
   ScrollView,
   StyleSheet,
   Text,
   TextInput,
   View,
} from "react-native";
import colors from "@/utils/colors";
import { Fonts } from "@/utils/fonts";
import AppImagePicker from "@/ui/AppImagePicker";
import * as ImagePicker from "expo-image-picker";
import CustomModal from "@/components/CustomModal";
import { Keys, getFromAsyncStorage } from "@/utils/asyncStorage";
import catchAsyncError from "@/api/catchError";
import { useDispatch, useSelector } from "react-redux";
import { upldateNotification } from "@/store/notification";
import Loader from "@/ui/Loader";
import { UploadData } from "@/@types/upload";
import _ from "lodash";
import { getAuthState, updateDescription } from "@/store/auth";
import client from "@/api/client";

interface Props { }

const Apartment: FC<Props> = (props) => {
   const [description, setDescription] = useState("");
   const [modalPhotoVisible, setModalPhotoVisible] = useState(false);
   const [modalDeletePhotoVisible, setModalDeletePhotoVisible] = useState(false);
   const [imageToDelete, setImageToDelete] = useState(null);
   const [gallery, setGallery] = useState([]);
   const [isLoading, setIsLoading] = useState(false);
   const dispatch = useDispatch();
   const { profile } = useSelector(getAuthState);

   // Query
   // const { data, isLoading, refetch,isSuccess } = useFetchLatestResidence();

   const fetchLatestResidence = async (): Promise<UploadData[] | undefined> => {
      const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);
      if (!token) return;

      const res = await fetch(client + `upload/residence`, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: `Bearer ${token}`,
         },
      });
      const data = await res.json();
      setGallery(data?.uploads);

      return data;
   };

   const handleTextChange = (inputText: React.SetStateAction<string>) => {
      setDescription(inputText);
      saveDescription(inputText);
   };

   const saveDescription = useCallback(
      _.debounce(async (newDescription) => {
         const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);
         if (!token) return;

         try {
            const res = await fetch(client + `profile/save/infos`, {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Origin": "*",
                  Authorization: `Bearer ${token}`,
               },
               body: JSON.stringify({ newDescription: newDescription }),
            });
            const data = await res.json();
            console.log("Description saved:", data);
            dispatch(updateDescription(newDescription))
            return data;
         } catch (error) {
            console.error("Error saving description", error);
         }
      }, 1000),
      []
   );

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
      }).then((result) => {
         if (!result.canceled) {
            uploadFile(result);
         }
      });
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
      formData.append("type", "Residence");
      formData.append("fileType", type);
      formData.append("fileUri", uploadImg.uri);

      const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);
      try {
         const response = await fetch(
            client + `upload/create/Residence`,
            {
               method: "POST",
               body: formData,
               headers: {
                  Authorization: "Bearer " + token,
               },
            }
         )


         if (response.ok) {
            dispatch(upldateNotification({ message: "Succès !", type: "success" }));
            await fetchLatestResidence();
         } else {
            const errorMessage = catchAsyncError(
               "Erreur lors de l'upload de l'image."
            );
            dispatch(upldateNotification({ message: errorMessage, type: "error" }));
         }
      } catch (error) {
         const errorResponse = error as Error;
         const errorMessage = catchAsyncError(errorResponse);
         dispatch(upldateNotification({ message: errorMessage, type: "error" }));
      }
   };

   const deleteFile = async () => {
      setModalDeletePhotoVisible(false);
      const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);
      if (imageToDelete) {
         try {
            const response = await fetch(client + "upload/delete", {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + token,
               },
               body: JSON.stringify(imageToDelete),
            }).then(() => {
               fetchLatestResidence();
            });
         } catch (error) {
            const errorMessage = catchAsyncError(
               "Erreur lors de la suppression de l'image sur Cloudinary"
            );
            dispatch(upldateNotification({ message: errorMessage, type: "error" }));
         }
      }
   };

   useEffect(() => {
      if (profile?.description) {

         setDescription(profile.description)
      }

      fetchLatestResidence();
   }, []);

   if (isLoading) {
      return (
         <View style={styles.container}>
            <Loader />
         </View>
      );
   }

   return (
      <ScrollView showsHorizontalScrollIndicator={false}>
         <View style={styles.container}>
            <Text style={styles.intitule}>Logements</Text>
            <View style={styles.row}>
               {gallery.map((item: { file: { url: any } } | any, index) => {
                  return (
                     <View key={index} style={styles.cell}>
                        <AppImagePicker
                           onClick={() => {
                              setModalDeletePhotoVisible(true);
                              setImageToDelete(item);
                           }}
                           imgSource={{ uri: item.file.url }}
                        />
                     </View>
                  );
               })}

               {gallery.length < 9 ? (
                  <View style={styles.cell}>
                     <AppImagePicker onClick={() => setModalPhotoVisible(true)} />
                  </View>
               ) : null}

               {/* Modal Photo */}
               <CustomModal
                  visible={modalPhotoVisible}
                  onSelectFromGallery={handleSelectFromGallery}
                  onTakePhoto={handleTakePhoto}
                  onClose={() => {
                     setModalPhotoVisible(!modalPhotoVisible);
                  }}
               />

               <CustomModal
                  visible={modalDeletePhotoVisible}
                  customMessage="Valider la suppression"
                  onCustomPress={deleteFile}
                  onClose={() => {
                     setModalDeletePhotoVisible(!modalDeletePhotoVisible);
                  }}
               />
            </View>

            <Text style={styles.intitule}>À propos</Text>

            <TextInput
               style={styles.textArea}
               multiline={true}
               onChangeText={handleTextChange}
               value={description}
               placeholderTextColor={colors.OVERLAY}
               placeholder="Décrivez vous en quelques lignes ..."
            />
         </View>
      </ScrollView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      alignItems: "center",
   },
   row: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "flex-start",
      alignSelf: "flex-start",
      marginBottom: 18,
      paddingStart: 25,
   },
   cell: {
      // aspectRatio: 1, // Pour que chaque cellule ait un aspect carré
      padding: 135 / 76,
      marginBottom: 10,
   },
   intitule: {
      marginTop: 10,
      fontSize: 18,
      fontWeight: "bold",
      color: colors.DARK,
      fontFamily: Fonts.regular,
      alignSelf: "flex-start",
      paddingHorizontal: 25,
      paddingVertical: 10,
   },
   textArea: {
      borderWidth: 1,
      borderColor: "#ccc",
      backgroundColor: "#FFF",
      borderRadius: 4,
      padding: 10,
      minHeight: 150,
      width: "90%",
   },
});

export default Apartment;
