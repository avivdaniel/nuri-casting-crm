import React, {useState, useEffect} from "react";
import dayjs from "dayjs";
import {getDownloadURL, deleteObject, ref, uploadBytes} from "firebase/storage";
import {addDoc, deleteDoc} from "firebase/firestore"
import {Icon, Form, Button, Header, Table, Segment, Input} from "semantic-ui-react";
import {collection, getDocs, doc} from "firebase/firestore";
import {db, storage} from "../../../firebase/index.jsx";
import {COLLECTIONS} from "../../../constants/collections.jsx";
import {useModelDetailsContext} from "../../../context/ModelDetailsContext.jsx";

export const Documents = () => {
    const {model} = useModelDetailsContext();
    const [document, setDocument] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(true);

    const modelRef = doc(db, COLLECTIONS.models, model.id);
    const modelDocsRef = collection(modelRef, "documents")

    const getDocuments = async () => {
        setLoading(true);
        try {
            const documentsSnap = await getDocs(modelDocsRef)
            setDocuments(
                documentsSnap.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                }))
            );
        } catch (err) {
            alert(err);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        (async () => await getDocuments())();
    }, [model.id]);

    const deleteDocument = async (documentId) => {
        if (window.confirm("למחוק את המסמך?")) {
            try {
                setLoading(true);
                // Delete the doc from the document sub collection
                await deleteDoc(doc(db, COLLECTIONS.models, model.id, "documents", documentId))
                const {fileName} = documents.find(doc => doc.id === documentId) || {};
                // Delete the doc from the storage
                if (fileName) {
                    const desertRef = ref(storage, fileName);
                    await deleteObject(desertRef)
                }
                await getDocuments();
            } catch (e) {
                alert(e);
            } finally {
                setLoading(false);
            }
        }
    };

    const onFileChange = (e) => {
        setDocument(e.target.files[0]);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!model.id || !document) return;
        try {
            setLoading(true);
            const fileName = `${model.id}/${new Date()
                .toISOString()
                .slice(0, 19)
                .replace(":", "-")}.jpg`
            const storageRef = ref(storage, fileName);
            const documentSnapshot = await uploadBytes(storageRef, document);
            const downloadUrl = await getDownloadURL(documentSnapshot.ref);
            await addDoc(modelDocsRef, {
                date: Date.now(),
                description,
                fileName,
                url: downloadUrl
            });
            await getDocuments();
            setDocument(null);
            setDescription('')
        } catch (err) {
            alert(err);
            setDocument(null);
            setDescription('')
        } finally {
            setLoading(false)
        }
    };

    return (
        <Segment loading={loading}>
            <Header>הוסף מסמך</Header>
            <Form onSubmit={onSubmit}>
                <Form.Group widths="equal">
                    <Input
                        type="file"
                        onChange={onFileChange}
                        width={5}
                    />
                    <Form.Input
                        placeholder="פרטים"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        width={6}
                    />
                    <Button color="green" loading={loading} disabled={loading || !document} width={5}>
                        הוסף מסמך
                    </Button>
                </Form.Group>
            </Form>
            <Table celled striped textAlign="right">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell width={2}>תאריך</Table.HeaderCell>
                        <Table.HeaderCell>פרטים</Table.HeaderCell>
                        <Table.HeaderCell width={1}>מחיקה</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {documents.length ? (
                        documents.map((document, i) => (
                            <Table.Row key={i}>
                                <Table.Cell>
                                    <a
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href={document.url}
                                    >
                                        {document?.date ? dayjs(document.date).format("DD/MM/YYYY") : 'לא קיים תאריך '}
                                    </a>
                                </Table.Cell>
                                <Table.Cell>{document.description}</Table.Cell>
                                <Table.Cell>
                                    <Icon
                                        link
                                        name="delete"
                                        onClick={() => deleteDocument(document.id)}
                                    />
                                </Table.Cell>
                            </Table.Row>
                        ))
                    ) : (
                        <Table.Row>
                            <Table.Cell colSpan="3">אין עדיין מסמכים להצגה</Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
        </Segment>
    );
};
