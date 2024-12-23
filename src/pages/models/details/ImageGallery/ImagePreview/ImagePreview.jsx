import React from "react";
import { Image, Header, Grid, Card } from "semantic-ui-react";

export const ImagePreview = ({ previewImages }) => {
  return (
    previewImages.length > 0 && (
      <div style={{ width: "100%" }}>
        <Header size="small">תצוגה מקדימה של התמונות שנבחרו</Header>
        <Grid columns={8}>
          {previewImages.map((preview) => (
            <Grid.Column key={preview.name}>
              <Grid.Row>
                <Card>
                  <Image
                    style={{
                      width: "100%",
                      height: "107px",
                      ObjectPosition: "top",
                      objectFit: "cover",
                    }}
                    src={preview.url}
                    ui={false}
                  />

                  <div>
                    <p className="ellipsis-text one-line">{preview.name}</p>
                  </div>
                </Card>
              </Grid.Row>
            </Grid.Column>
          ))}
        </Grid>
      </div>
    )
  );
};
