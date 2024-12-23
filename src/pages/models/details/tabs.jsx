import React, { useState } from "react";
import { Button, Label } from "semantic-ui-react";
import { useModelDetailsContext } from "../../../context/ModelDetailsContext.jsx";
import ModelSessionTable from "./ModelSessionTable.jsx";
import ModelForm from "../../../components/Ui/ModelForm/ModelForm.jsx";
import ModelNotes from "./ModelNotes.jsx";
import { Documents } from "./Documents.jsx";
import { Commission } from "./Commission.jsx";
import { ModelSalary } from "./ModelSalary/ModelSalary.jsx";
import { ModelBankDetailsTable } from "./ModelBankDetailsTable.jsx";
import { updateDoc } from "../../../services/index.jsx";
import { COLLECTIONS } from "../../../constants/collections.jsx";
import { EmploymentStatus } from "./EmploymentStatus/EmploymentStatus.jsx";
import AddModelSession from "./AddModelSession/AddModelSession.jsx";
import { ImageGallery } from "./ImageGallery/ImageGallery.jsx";

const DeleteModelButton = () => {
  const { api, model, loadingModel, setModel } = useModelDetailsContext();
  const [loading, setLoading] = useState(false);

  const handleToggleActive = async () => {
    if (!model?.id) return;
    setLoading(true);
    try {
      await updateDoc(COLLECTIONS.models, model.id, {
        isActive: !model?.isActive,
      });
      setModel((prev) => ({ ...prev, isActive: !model?.isActive }));
    } catch (e) {
      alert(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Button
        color="red"
        disabled={loadingModel}
        onClick={async () => await api.deleteModel(model.id)}
      >
        מחק מיוצג
      </Button>
      <Button
        color={model?.isActive ? "yellow" : "green"}
        disabled={loadingModel || loading}
        loading={loading}
        onClick={async () => await handleToggleActive()}
      >
        {model?.isActive ? "הוסף לארכיון" : "הסר מארכיון"}
      </Button>
    </>
  );
};

const MessagesBudge = () => {
  const { model } = useModelDetailsContext();
  return (
    <>
      עדכן הערות
      {!!model?.notes?.length && (
        <Label color="red">{model.notes.length}</Label>
      )}
    </>
  );
};

export const MODEL_DETAILS_TABS = [
  { menuItem: { key: "title", content: "פעולות" } },
  {
    menuItem: { key: "modelSessions", content: "ימי צילום" },
    component: <ModelSessionTable />,
  },
  {
    menuItem: { key: "addModelSession", content: "הוסף ליום צילום" },
    component: <AddModelSession />,
  },
  {
    menuItem: { key: "image", content: "גלריית תמונות" },
    component: <ImageGallery />,
  },
  {
    menuItem: { key: "update", content: "עדכן פרטים" },
    component: <ModelForm />,
  },
  {
    menuItem: { key: "messages", content: <MessagesBudge /> },
    component: <ModelNotes />,
  }, //notes
  {
    menuItem: { key: "commission", content: "עדכן עמלה" },
    component: <Commission />,
  },
  {
    menuItem: { key: "salary", content: "שכר אומנים" },
    component: <ModelSalary />,
  },
  {
    menuItem: { key: "bankDetails", content: "פרטי חשבון בנק" },
    component: <ModelBankDetailsTable />,
  },
  {
    menuItem: { key: "documents", content: "מסמכים" },
    component: <Documents />,
  },
  {
    menuItem: { key: "employmentStatus", content: "מעמד תעסוקתי" },
    component: <EmploymentStatus />,
  },
  {
    menuItem: { key: "delete", content: "מחק/ארכיון" },
    component: <DeleteModelButton />,
  },
];
