import { useState, useCallback, useEffect } from "react";
import {
  getDownloadURL,
  deleteObject,
  ref,
  uploadBytes,
  getBlob,
} from "firebase/storage";
import {
  addDoc,
  deleteDoc,
  collection,
  getDocs,
  doc,
} from "firebase/firestore";
import { db, storage } from "../../../../firebase/index.jsx";
import { COLLECTIONS } from "../../../../constants/collections.jsx";
import { useModelDetailsContext } from "../../../../context/ModelDetailsContext.jsx";

export const useImageGallery = () => {
  const { model, api } = useModelDetailsContext();
  const [selectedImages, setSelectedImages] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploaderKey, setUploaderKey] = useState(Date.now()); // For resetting the uploader

  const modelDocRef = doc(db, COLLECTIONS.models, model.id);
  const galleryCollectionRef = collection(modelDocRef, "gallery");

  const fetchGalleryImages = useCallback(async () => {
    try {
      const snapshot = await getDocs(galleryCollectionRef);
      setGalleryImages(
        snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })),
      );
    } catch (error) {
      alert(`Error fetching images: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [galleryCollectionRef]);

  const handleDeleteImage = async (imageId) => {
    if (window.confirm("למחוק את התמונה?")) {
      try {
        setIsLoading(true);
        const imageDocRef = doc(
          db,
          COLLECTIONS.models,
          model.id,
          "gallery",
          imageId,
        );

        await deleteDoc(imageDocRef);

        const { fileName } =
          galleryImages.find((img) => img.id === imageId) || {};
        if (fileName) {
          const storageRef = ref(storage, fileName);
          await deleteObject(storageRef);
        }

        await fetchGalleryImages();
      } catch (error) {
        alert(`Error deleting image: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleUploadImage = async () => {
    if (!model.id || selectedImages.length === 0) return;
    try {
      setIsLoading(true);
      await Promise.all(
        selectedImages.map(async (file) => {
          const fileName = `${model.id}/${crypto.randomUUID()}.jpg`;
          const storageRef = ref(storage, fileName);

          const snapshot = await uploadBytes(storageRef, file);
          const downloadUrl = await getDownloadURL(snapshot.ref);

          await addDoc(galleryCollectionRef, {
            date: Date.now(),
            fileName,
            url: downloadUrl,
          });
        }),
      );

      await fetchGalleryImages();
    } catch (error) {
      alert(`Error uploading image: ${error.message}`);
    } finally {
      setSelectedImages([]);
      setPreviewImages([]);
      setUploaderKey(Date.now());
      setIsLoading(false);
    }
  };

  const handleFileChange = (event) => {
    setSelectedImages(event.value);
    // Generate preview URLs for the selected files
    const previews = event.value.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    setPreviewImages(previews);
  };

  const clearPreviews = () => {
    previewImages.forEach((preview) => URL.revokeObjectURL(preview.url)); // Clean up object URLs
    setPreviewImages([]);
  };
  /**
   * Handles setting the profile image for a user.
   * This function deletes the old profile image (if any), uploads a new image as the profile image,
   * and updates the user's model with the new image URL.
   *
   * It preserves the old behavior where the profile image is saved under the user's `model.id` as a `.jpg` file
   * in Firebase Storage. This ensures that the previous functionality of storing only one profile image
   * remains intact while supporting setting a new image.
   *
   * @param {string} fileName - The file name of the image to set as the new profile image.
   *        This should be the storage path to the image in Firebase (e.g., "gallery/newImage.jpg").
   */
  const handleSetAsProfileImage = async (fileName) => {
    setIsLoading(true); // Set loading state to true before starting the process

    try {
      // 1. Delete the old profile image from storage
      const oldProfileImageRef = ref(storage, `${model.id}.jpg`);
      try {
        await deleteObject(oldProfileImageRef);
      } catch (e) {
        console.log(
          "No existing profile image to delete, continuing with upload.",
        );
      }

      // 2. Fetch the new image file from storage
      const newImageRef = ref(storage, fileName);
      const imageBlob = await getBlob(newImageRef);

      // 3. Upload the new image as the profile image
      const profileImageRef = ref(storage, `${model.id}.jpg`);
      const uploadResult = await uploadBytes(profileImageRef, imageBlob);

      // 4. Get the download URL for the new profile image
      const downloadURL = await getDownloadURL(uploadResult.ref);

      // 5. Update the model with the new profile image URL
      await api.updateModel(model.id, {
        image: downloadURL,
      });
    } catch (e) {
      throw e; // Rethrow the error to handle it elsewhere if needed
    } finally {
      setIsLoading(false); // Set loading state to false after the process is complete (success or failure)
    }
  };

  useEffect(() => {
    (async () => await fetchGalleryImages())();
    return () => clearPreviews();
  }, []);

  return {
    galleryImages,
    selectedImages,
    previewImages,
    isLoading,
    uploaderKey,
    setSelectedImages,
    handleFileChange,
    handleUploadImage,
    handleDeleteImage,
    handleSetAsProfileImage,
  };
};
