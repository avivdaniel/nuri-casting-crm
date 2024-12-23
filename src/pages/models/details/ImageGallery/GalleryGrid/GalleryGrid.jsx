import React from "react";
import { Card, Message, Button, Icon } from "semantic-ui-react";
import dayjs from "dayjs";
import { saveAs } from "file-saver";
import "./GalleryGrid.scss";

export const GalleryGrid = ({
  galleryImages,
  handleDeleteImage,
  handleSetAsProfileImage,
}) => {
  const handleDownloadImage = async (url) => {
    const response = await fetch(url);
    const imageBlob = await response.blob();
    saveAs(imageBlob, "gallery-image");
  };

  return (
    <>
      {galleryImages.length ? (
        <Card.Group className="GalleryGrid" itemsPerRow={4}>
          {galleryImages.map((img) => (
            <Card as="a" className="gallery-card" key={img.id}>
              <div className="image-container">
                <img src={img.url} alt="gallery item" />
                <Button
                  icon
                  className="profile-icon-button"
                  onClick={() => handleSetAsProfileImage(img.fileName)}
                >
                  <Icon name="user circle" />
                </Button>
              </div>
              <Card.Content>
                <Card.Meta textAlign="center">
                  {img.date
                    ? dayjs(img.date).format("DD/MM/YYYY")
                    : "לא קיים תאריך"}
                </Card.Meta>
              </Card.Content>
              <Card.Content extra>
                <div dir="ltr" className="ui two buttons">
                  <Button
                    onClick={() => handleDeleteImage(img.id)}
                    basic
                    color="red"
                  >
                    מחק
                  </Button>
                  <Button
                    onClick={() => handleDownloadImage(img.url)}
                    basic
                    color="green"
                  >
                    הורד
                  </Button>
                </div>
              </Card.Content>
            </Card>
          ))}
        </Card.Group>
      ) : (
        <Message info>
          <Message.Header>אין תמונות גלריה להצגה</Message.Header>
          <p>הוסף תמונות חדשות כדי לראותן כאן.</p>
        </Message>
      )}
    </>
  );
};
