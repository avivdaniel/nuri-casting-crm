import React, { useState } from "react";
import dayjs from "dayjs";
import { Form, Button, Message } from "semantic-ui-react";
import { useModelDetailsContext } from "../../../context/ModelDetailsContext.jsx";

const ModelNotes = () => {
  const { model, api, loadingModel } = useModelDetailsContext();
  const [note, setNote] = useState("");
  const modelNotes = model?.notes || [];

  const handleDeleteNote = async (noteId) => {
    try {
      const filtredNotes = modelNotes.filter((note) => note.id !== noteId);
      await api.updateModel(model.id, {
        notes: filtredNotes,
      });
    } catch (e) {
      alert(e);
    }
  };

  const updateModelNotes = async () => {
    if (!model.id) return;
    try {
      const newNote = { id: Date.now(), text: note, createdAt: Date.now() };
      await api.updateModel(model.id, {
        notes: [...modelNotes, newNote],
      });
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div>
      <Form onSubmit={updateModelNotes} noValidate loading={loadingModel}>
        <Form.Group>
          <Form.Field width={14} required>
            <input
              name="comment"
              placeholder="הערה"
              onChange={(e) => setNote(e.target.value.trimStart())}
              required
            />
          </Form.Field>
          <Form.Field>
            <Button
              disabled={loadingModel || note.length < 1}
              loading={loadingModel}
            >
              הוסף הערה
            </Button>
          </Form.Field>
        </Form.Group>
      </Form>
      <div>
        {modelNotes.map((note) => {
          return (
            <Message
              key={note.id}
              info
              header={dayjs(note.createdAt).format("DD/MM/YYYY")}
              content={note.text}
              onDismiss={() => handleDeleteNote(note.id)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ModelNotes;
