import React from "react";
import FileUploader from "devextreme-react/file-uploader";
import { Form, Button, Segment, Grid, Icon } from "semantic-ui-react";
import { GalleryGrid } from "./GalleryGrid/GalleryGrid.jsx";
import { useImageGallery } from "./useImageGallery.jsx";
import { ImagePreview } from "./ImagePreview/ImagePreview.jsx";

export const ImageGallery = () => {
  const {
    galleryImages,
    selectedImages,
    isLoading,
    uploaderKey,
    handleFileChange,
    handleUploadImage,
    handleDeleteImage,
    handleSetAsProfileImage,
    previewImages,
  } = useImageGallery();

  return (
    <Segment loading={isLoading} className="segment-grey">
      <Segment>
        <Form onSubmit={handleUploadImage}>
          <Form.Group widths="equal">
            <Button
              icon
              style={{ alignSelf: "start", marginTop: "16px" }}
              color="green"
              loading={isLoading}
              disabled={!selectedImages.length || isLoading}
            >
              <Icon name="upload" />
            </Button>
            <FileUploader
              key={uploaderKey} // Reset the FileUploader by changing the key
              multiple
              rtlEnabled
              uploadMode="useButtons"
              allowCanceling
              onValueChanged={handleFileChange}
              disabled={isLoading}
            />
          </Form.Group>
          <Form.Group>
            <ImagePreview previewImages={previewImages} />
          </Form.Group>
        </Form>
      </Segment>
      <GalleryGrid
        galleryImages={galleryImages}
        handleDeleteImage={handleDeleteImage}
        handleSetAsProfileImage={handleSetAsProfileImage}
      />
    </Segment>
  );
};
